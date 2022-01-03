<template>
  <transition name="fade">
    <Loading v-show="isLoading" />
  </transition>
  <router-view />
</template>
<script>
import '@/scss/all.scss'
import { watch } from 'vue'
import useStore from '../src/methods/store'
import Loading from './components/Loading'
export default {
  components: {
    Loading
  },
  setup () {
    // ---- variable ----//
    const { isLoading } = useStore()

    // ---- watch ----//
    /* 瀑布流載入新資料時，Loading動畫覆蓋，使畫面無法再滾動 */
    watch(isLoading, () => {
      const scrollTop = window.scrollY

      if (isLoading.value) {
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.top = `-${scrollTop}px`
      } else {
        const scrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        window.scrollTo(0, parseInt(scrollY, 10) * -1)
      }
    })
    return {
      isLoading
    }
  }
}
</script>
<style lang="scss" scoped>

.fade-leave{
  opacity: 1;
}
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}
.fade-leave-to{
  opacity: 0;
}
</style>
