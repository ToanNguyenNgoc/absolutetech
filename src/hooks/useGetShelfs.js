import { ShelfApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetShelfs(params, options) {
  const queryKey = computed(() => ['shelfs', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => ShelfApi.get({...params}),
    ...options
  });

  const response = computed(() => query.data.value?.data);
  return Object.assign(query, {
    response,
    shelfs: computed(() => response.value?.list || [])
  })
}