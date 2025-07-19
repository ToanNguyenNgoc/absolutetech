import { getUsers } from "@/api/user";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetUsers(options) {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(1, 100)
  })
  const roles = options?.roles || [];
  const users = computed(() => roles.length > 0 ? (data.value?.data?.data?.list || []).filter(i => roles.includes(i.role)) : (data.value?.data?.data?.list || []));
  return users
}