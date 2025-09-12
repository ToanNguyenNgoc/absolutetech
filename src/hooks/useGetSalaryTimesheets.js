import { SalaryApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetSalaryTimesheets(params, options) {
  const queryKey = computed(() => ['salary/timesheets', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => SalaryApi.getSalaryTimesheet({ ...params }),
    ...options,
  });
  return Object.assign(query, {
    response: computed(() => query.data.value?.data),
    salaryTimesheets: computed(() => query.data.value?.data?.list || []),
  })
}