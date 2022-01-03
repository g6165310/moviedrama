import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import useCombine from './adjustData'
import useStore from './store'
export default function () {
  const router = useRouter()
  const state = reactive({
    results: [],
    totalPages: 0,
    error: null
  })
  const { combine } = useCombine()
  const { toggleIsLoading } = useStore()
  const fetchData = async (path, params, isDaily) => {
    state.error = null
    const response = reactive({
      results: [],
      responseZh: null,
      responseUs: null,
      totalPages: 0,
      totalRes: 0
    })
    // 由於 getDaily 會重複執行 fetchData 直到有資料為止，為了不讓 loading 動畫反覆出現
    if (!isDaily) {
      toggleIsLoading()
    }
    const option = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: path,
        page: params.page || null,
        region: params.region || null,
        query: params.query || null,
        append_to_response: params.append || null
      })
    }
    try {
      const resZh = await fetch(`${process.env.VUE_APP_PROXY_PATH}?language=zh-TW`, option)
      const resUs = await fetch(`${process.env.VUE_APP_PROXY_PATH}?language=en-US`, option)
      response.responseZh = await resZh.json()
      response.responseUs = await resUs.json()
      if (response.responseZh.success === false) {
        throw new Error(resZh.value.status_message)
      }
      response.totalPages = response.responseZh.total_pages || 0
      response.totalRes = response.responseZh.total_results || null
    } catch (error) {
      state.error = error.message
    }
    if (!isDaily) {
      toggleIsLoading()
    }
    return { ...toRefs(response) }
  }
  // 取得現正熱映
  const getNowing = async (page) => {
    const { responseZh, responseUs, totalPages } = await fetchData('movie/now_playing', { page, region: 'TW' })
    if (state.error) {
      router.replace('/NotFound')
      return
    }
    state.results = combine(responseZh.value.results, responseUs.value.results)
    state.totalPages = totalPages.value
  }
  const getDaily = async () => {
    const isDaily = true
    const date = `${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`
    if (!localStorage.getItem('date') || localStorage.getItem('date') !== date) {
      const type = (Math.random() * 1 <= 0.4) ? 'movie' : 'tv'
      const { responseZh } = await fetchData(`${type}/latest`, {}, isDaily)
      while (1) {
        const random = Math.floor(Math.random() * (responseZh.value.id + 1))
        await getDetails(type, random, isDaily)
        if (state.error || state.results.adult) {
          continue
        }
        state.results.type = type
        break
      }
      localStorage.setItem('daily', JSON.stringify(state.results))
      localStorage.setItem('type', type)
      localStorage.setItem('date', date)
    } else {
      state.results = JSON.parse(localStorage.getItem('daily'))
    }
  }
  const getPopular = async (type, page) => {
    const { responseZh, responseUs, totalPages } = await fetchData(`${type}/popular`, { page, region: 'TW' })
    if (state.error) {
      router.replace('/NotFound')
      return
    }
    state.results = combine(responseZh.value.results, responseUs.value.results)
    state.totalPages = totalPages.value
  }
  const getDetails = async (type, id, isDaily) => {
    const { responseZh, responseUs } = await fetchData(`${type}/${id}`, { append: 'keywords%2Cimages%2Ccredits' }, isDaily)
    // 由於 getDaily 會重複執行直到有資料為止，為了防止因為沒資料直接跳轉到 NotFound
    if (state.error && !isDaily) {
      router.replace('/NotFound')
      return
    }
    state.results = combine([responseZh.value], [responseUs.value])[0]
    if (type === 'tv' && !isDaily) {
      state.results.seasons = await getEpisodes(state.results.id, state.results.seasons)
    }
    if (state.results.belongs_to_collection && !isDaily) {
      const collection = await getCollection(state.results.belongs_to_collection.id)
      state.results.belongs_to_collection.parts = collection[0].parts
    }
  }
  const getEpisodes = async (id, seasons) => {
    const episodes = ref([])
    for (let i = 0; i < seasons.length; i++) {
      const { responseZh, responseUs } = await fetchData(`tv/${id}/season/${seasons[i].season_number}`, {})
      responseZh.value.overview = responseZh.value.overview ? responseZh.value.overview : responseUs.value.overview
      responseZh.value.episodes = combine(responseZh.value.episodes, responseUs.value.episodes)
      episodes.value.push(responseZh.value)
    }
    return episodes
  }
  const getCollection = async (id) => {
    const { responseZh, responseUs } = await fetchData(`collection/${id}`, {})
    return combine([responseZh.value], [responseUs.value])
  }
  const getSearch = async (page, query) => {
    const { responseZh, responseUs, totalPages, totalRes } = await fetchData('search/multi', { page, query })
    if (state.error) {
      router.replace('/NotFound')
      return
    }

    state.results = combine(responseZh.value.results, responseUs.value.results)
    state.totalPages = totalPages.value
    state.results.totalRes = totalRes.value
  }
  const getPerson = async (id) => {
    const { responseZh, responseUs } = await fetchData(`person/${id}`, { append: 'combined_credits' })
    if (state.error) {
      router.replace('/NotFound')
      return
    }
    state.results = combine([responseZh.value], [responseUs.value])[0]
  }
  return { ...toRefs(state), getNowing, getDaily, getPopular, getEpisodes, getDetails, getCollection, getSearch, getPerson }
}
