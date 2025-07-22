import { SpareApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetSpares(params) {
  const query = useQuery({
    queryKey: computed(() => ['spares', params]),
    queryFn: () => SpareApi.get({ ...params }),
  });

  return Object.assign(query, {
    response: computed(() => query.data.value?.data),
    spares: computed(() => query.data.value?.data?.list || []),
  })
}