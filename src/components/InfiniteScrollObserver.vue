<template>
  <div
    ref="detectArea"
    class="detectArea"
  />
</template>
<script>
import { onMounted, onUnmounted, ref } from 'vue'
export default {
  name: 'InfiniteScrollObserver',
  emits: {
    'callback-function': null
  },
  setup (props, { emit }) {
    const detectArea = ref(null)
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        emit('callback-function')
      }
    }, options)
    onMounted(() => {
      observer.observe(detectArea.value)
    })
    onUnmounted(() => {
      observer.disconnect()
    })
    return {
      detectArea
    }
  }
}
</script>
