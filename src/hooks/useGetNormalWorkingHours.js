import { NormalWorkingHourApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetNormalWorkingHours(params, options) {
  const queryKey = computed(() => ['normal-working-hours', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => NormalWorkingHourApi.get({ ...params }),
    ...options
  });

  return Object.assign(query, {
    response: computed(() => query.data.value?.data),
    normalWorkingHours: computed(() => query.data.value?.data?.list || []),
  })
}