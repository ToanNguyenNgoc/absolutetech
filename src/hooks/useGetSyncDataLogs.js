import { LogApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetSyncDataLogs(params, options) {
  const queryKey = computed(() => ['sync-data-logs', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => LogApi.getSyncDataLogs({ ...params }),
    ...options
  });

  return Object.assign(query, {
    response: computed(() => query.data.value?.data),
    logs: computed(() => query.data.value?.data?.list || []),
  })
}