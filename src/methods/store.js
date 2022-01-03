import { ref, computed } from 'vue'
const isLoading = ref(false)
const isNavOpen = ref(false)
export default function useStore () {
  const toggleIsLoading = () => {
    isLoading.value = !isLoading.value
  }
  const toggleIsNavOpen = () => {
    isNavOpen.value = !isNavOpen.value
  }
  return {
    isLoading: computed(() => isLoading.value),
    isNavOpen: computed(() => isNavOpen.value),
    toggleIsLoading,
    toggleIsNavOpen
  }
}
