<template>
  <h3>——搜尋結果——</h3>
  <span
    v-if="hasSearched"
    class="totalResult"
  >目前目標:{{ route.query.search }}<br>共 {{ totalRes }} 筆</span>
  <div class="result__container d-flex-center flex-col">
    <ul
      v-if="searchResult.length"
      class="result__list"
    >
      <li
        v-for="item in searchResult"
        :key="item.id"
        class="result__item ticketDecorate"
      >
        <router-link :to="`/${item.media_type==='person'?'actor':item.media_type}/${item.id}`" />
        <div class="result__poster">
          <img
            v-if="item['poster_path']"
            :src="`https://image.tmdb.org/t/p/w600_and_h900_bestv2`+ item['poster_path']"
            alt=""
          >
          <img
            v-else-if="item['profile_path']"
            :src="`https://image.tmdb.org/t/p/original`+ item['profile_path']"
            alt=""
          >
          <img
            v-else
            src="../assets/noimage.jpg"
            alt=""
          >
        </div>
        <div class="result__content">
          <h2 class="result__title">
            {{ item.title||item.name }}
          </h2>
          <p
            v-if="item.media_type!='person'"
            class="result__overview"
          >
            {{ item.overview|| '暫無資料' }}
          </p>
          <ul
            v-else
            class="result__overview actorWork"
          >
            <span>代表作:</span>
            <li
              v-for="work in item['known_for']"
              :key="work.id"
            >
              {{ work.title||work.name }}
            </li>
          </ul>
        </div>
        <div
          v-if="item.media_type!='person'"
          class="result__type"
        >
          {{ item.media_type==='tv'?"DRAMA":"MOVIE" }}
        </div>
        <div
          v-else
          class="result__type"
        >
          ACTOR
        </div>
      </li>
    </ul>
    <InfiniteScrollObserver @callback-function="handler" />
    <span
      v-if="page===totalPages"
      class="showAll"
    >
      已顯示所有結果
    </span>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import useStore from '../methods/store'
import useData from '../methods/getData'
import InfiniteScrollObserver from '../components/InfiniteScrollObserver.vue'
export default {
  name: 'SearchResult',
  components: {
    InfiniteScrollObserver
  },
  setup () {
    // ---- variable ----//
    const route = useRoute()
    const { isLoading } = useStore()
    const page = ref(1)

    // ---- Search Result ----//
    const { results, totalPages, getSearch } = useData()
    const hasSearched = ref(false)
    const searchResult = ref([])
    const totalRes = computed(() => results.value.totalRes || 0)

    onBeforeRouteUpdate(async (to) => {
      if (!route.query.search) {
        return
      }
      window.scrollTo(0, 0)
      page.value = 1
      totalPages.value = 0
      searchResult.value = []
    })

    // ---- infinite scrolling ----//
    const handler = async () => {
      if (isLoading.value || totalPages.value === page.value) {
        return
      }
      hasSearched.value = false
      await getSearch(page.value, route.query.search)
      page.value = totalPages.value === page.value ? page.value : page.value + 1
      searchResult.value.push(...results.value)
      hasSearched.value = true
    }

    return {
      route,
      searchResult,
      page,
      totalPages,
      totalRes,
      hasSearched,
      handler
    }
  }

}
</script>

<style lang="scss" scoped>
h3 {
  text-align: center;
  color: $highlight;
  @include respond-to(phone) {
    font-size: $b-fontSize * 1.5;
  }
}
.result {
  &__container{
    min-height: 40vh;
  }
  &__list{
    max-width: 600px;
    min-width: 300px;
    padding: 20px;
    @include respond-to(pc) {
      max-width: 1200px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
  &__item {
    display: flex;
    height: 150px;
    background-color: $highlight;
    margin-bottom: $b-space-m;
    padding: 10px;
    @include respond-to(pad) {
      height: 240px;
    }
    @include respond-to(pc) {
      height: 300px;
      width: 47.5%;
    }
    //連結點擊區域
    &>a{
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    &:hover img{
      transform: scale(1.2);
    }
  }
  &__poster {
    width: 90px;
    border: $secondary solid $b-space-s * 0.4;
    border-right: none;
    border-top-left-radius: $b-space-s * 0.75;
    border-bottom-left-radius: $b-space-s * 0.75;
    img {
      vertical-align: bottom;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: all 0.3s;
    }
    overflow: hidden;
    @include respond-to(pad) {
      width: 180px;
    }
  }
  &__content {
    flex: 1;
    border: $secondary solid $b-space-s * 0.4;
    @include respond-to(phone){
      min-width: 300px;
    }
  }
  &__title {
    border-bottom: $secondary solid $b-space-s * 0.4;
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    @include respond-to(pad) {
      font-size: $b-fontSize * 1.25;
    }
  }
  &__overview {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin: 6px;
    @include respond-to(pad){
      -webkit-line-clamp: 6;
    }
    @include respond-to(pc) {
      font-size: $b-fontSize * 1.25;

    }
  }
  &__type {
    display: none;
    @include respond-to(phone) {
      display: block;
      writing-mode: vertical-rl;
      text-align: center;
      letter-spacing: $b-space-s*0.5;
      border: $secondary solid $b-space-s * 0.4;
      border-left: none;
      border-top-right-radius: $b-space-s * 0.75;
      border-bottom-right-radius: $b-space-s * 0.75;
      font-size:$b-fontSize;
    }
    @include respond-to(pad) {
      font-size: $b-fontSize * 1.5;
       letter-spacing: $b-space-s;
    }
  }
}
.totalResult{
  display: block;
  text-align: center;
  font-size: $b-fontSize * 1.5;
}
.showAll{
  color: $highlight;
  position: relative;
  font-size: $b-fontSize*1.25;
  &::before{
    content: '';
    position: absolute;
    top: 50%;
    left: -25%;
    transform: translateY(-50%);
    background-color: $secondary;
    height: 40%;
    width: 150%;
    z-index: -1;
  }
}
.ticketDecorate{
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 10px;
    height: 100%;
  }
  &::before {
    background: radial-gradient(
        circle at 0% 15px,
        transparent 10px,
        $highlight 0
      )
      0% 0px;
    background-size: 30px 30px;
    background-repeat: repeat-y;
    left: -10px;
  }
  &::after {
    background: radial-gradient(
        circle at 100% 15px,
        transparent 10px,
        $highlight 0
      )
      100% 0px;
    background-size: 30px 30px;
    background-repeat: repeat-y;
    right: -10px;
  }
}
.actorWork{
  span{
    font-size: $b-fontSize;
    display: block;
    margin-bottom: $b-space-s*0.2;
    color:$secondary;
    font-weight: 900;
    @include respond-to(pad){
      margin-bottom: $b-space-s;
    }
    @include respond-to(pc){
      font-size: $b-fontSize*1.5;
    }
  }
  li{
    padding-bottom: $b-space-s*0.5;
    @include respond-to(pc){
      font-size: $b-fontSize*1.5;
    }
  }
}
</style>
