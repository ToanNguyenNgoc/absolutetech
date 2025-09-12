import { SalaryApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetSalaryJobnumbers(params, options) {
  const queryKey = computed(() => ['salary/job-numbers', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => SalaryApi.getSalaryJobNumber({ ...params }),
    ...options
  });
  return Object.assign({
    response: computed(() => query.data.value?.data),
    salaryJobNumbers: computed(() => query.data.value?.data?.list || []),
  })
}