<template>
  <h3>——現正熱映——</h3>
  <div

    v-if="nowing.length"
    class="nowing bg-strip"
  >
    <ul
      class="nowing__list"
    >
      <li
        v-for="(movie) in nowing"
        :key="movie.id"
        class="nowing__item"
      >
        <Card :item="movie">
          <router-link :to="'/movie/' + movie.id" />
        </Card>
      </li>
    </ul>
  </div>
  <InfiniteScrollObserver @callback-function="handler" />
</template>

<script>
import { ref } from 'vue'
import useData from '../methods/getData'
import useStore from '../methods/store'
import Card from '../components/Card'
import InfiniteScrollObserver from '../components/InfiniteScrollObserver.vue'
export default {
  name: 'Home',
  components: {
    Card,
    InfiniteScrollObserver
  },
  setup (context) {
    // ---- variable ----//
    const { isLoading } = useStore()
    const page = ref(1)

    // ---- nowing ----//
    const nowing = ref([])
    const { results, totalPages, getNowing } = useData()
    // ---- infinite scrolling ----//
    const handler = async () => {
      if (isLoading.value || totalPages.value === page.value) {
        return
      }
      await getNowing(page.value)
      page.value = totalPages.value === page.value ? page.value : page.value + 1
      nowing.value.push(...results.value)
    }

    return {
      nowing,
      handler
    }
  }

}
</script>
<style lang="scss" scoped>
.nowing {
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
h3{
  letter-spacing: 0.5*$b-fontSize;
  color:$highlight;
  text-align: center;
  font-size: $b-fontSize-2x;
  @include respond-to(phone-h){
    letter-spacing: $b-fontSize;
  }
}

</style>
