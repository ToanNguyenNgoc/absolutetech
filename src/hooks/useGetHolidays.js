import { HolidayApi } from "@/api/holiday";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetHolidays(params, options) {
  const queryKey = computed(() => ['holidays', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => HolidayApi.get({ ...params }),
    ...options
  });

  return Object.assign(query, {
    response: computed(() => query.data.value?.data),
    holidays: computed(() => query.data.value?.data?.list || []),
  })
}