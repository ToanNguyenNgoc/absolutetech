import { computed, onMounted, onUnmounted, ref } from "vue"

export function useDialogFromSize() {
  const isMobile = ref(false)
  const dialogWidth = computed(() => (isMobile.value ? '343px' : '85vw'))
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  });
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  });

  return {
    isMobile,
    dialogWidth
  }
}