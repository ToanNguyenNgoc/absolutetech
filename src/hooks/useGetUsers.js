import { getUsers } from "@/api/user";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetUsers(params, options) {
  const queryKey = computed(() => ['users', { ...params }]);
  const { data } = useQuery({
    queryKey,
    queryFn: () => getUsers(params),
    ...options
  })
  const users = computed(() => (data.value?.data?.data?.list || []));
  return users
}