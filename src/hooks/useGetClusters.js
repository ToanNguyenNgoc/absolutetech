import { ClusterApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue"

export function useGetClusters(params, options) {
  const queryKey = computed(() => ['clusters', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => ClusterApi.get(params),
    ...options
  })
  const response = computed(() => query.data.value?.data);
  return Object.assign(query, {
    response,
    clusters: computed(() => response.value?.list || [])
  })
}