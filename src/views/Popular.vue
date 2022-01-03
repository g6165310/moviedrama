<template>
  <h3>—— {{ title }} ——</h3>
  <div

    v-if="popular.length"
    class="popular__container bg-strip"
  >
    <ul
      class="popular__list"
    >
      <li
        v-for="item in popular"
        :key="item.id"
      >
        <Card :item="item">
          <router-link :to="'/'+type+'/' + item.id" />
        </Card>
      </li>
    </ul>
  </div>
  <InfiniteScrollObserver @callback-function="handler" />
</template>

<script>
import { ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import useStore from '../methods/store'
import useData from '../methods/getData'
import Card from '../components/Card'
import InfiniteScrollObserver from '../components/InfiniteScrollObserver.vue'
export default {
  name: 'Home',
  components: {
    Card,
    InfiniteScrollObserver
  },
  setup () {
    // ---- variable ----//
    const route = useRoute()
    const { isLoading } = useStore()
    const title = ref('')
    const type = ref(route.params.type)
    // ---- popular data ----//
    const popular = ref([])
    const page = ref(1)
    const { results, totalPages, getPopular } = useData()
    onBeforeRouteUpdate(async (to, from) => {
      window.scrollTo(0, 0)
      page.value = 1
      popular.value = []
    })
    watch(() => route.params.type, () => {
      title.value = route.params.type === 'movie' ? '熱門電影' : '熱門影集'
      type.value = route.params.type
    }, { immediate: true })

    // ---- infinite scrolling ----//
    const handler = async () => {
      console.log(type.value)
      if (isLoading.value || totalPages.value === page.value) {
        return
      }
      await getPopular(type.value, page.value)
      page.value = totalPages.value === page.value ? page.value : page.value + 1
      popular.value.push(...results.value)
    }

    return {
      type,
      title,
      popular,
      totalPages,
      page,
      handler
    }
  }

}
</script>
<style lang="scss" scoped>
h3{
  letter-spacing: 0.5*$b-fontSize;
  color:$highlight;
  text-align: center;
  font-size: $b-fontSize-2x;
  @include respond-to(phone-h){
    letter-spacing: $b-fontSize;
  }
}
.popular {
  &__container {
    @include respond-to(pad) {
      display: flex;
      flex-direction: column;
    }
  }
  &__list {
    width: 100%;
    @include respond-to(pad) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      grid-gap: 20px;
      grid-row-gap: $b-space-l;
    }
    li {
      margin-bottom: 36px;
      @include respond-to(pad) {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
