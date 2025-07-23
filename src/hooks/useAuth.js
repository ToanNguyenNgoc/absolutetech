import { globalState } from "@/store/globalState";
import { computed } from "vue";

export function useAuth() {
  const userInfo = computed(() => globalState.userInfo);
  return {
    userInfo
  }
}