import { getJobNumbers } from "@/api/jobnumber";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetJobNumbers(params) {
  const queryKey = computed(() => ['job-numbers', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => getJobNumbers({ ...params }),
  })

  const response = computed(() => query.data.value?.data?.data);
  return Object.assign(query, {
    response,
    job_numbers: computed(() => response.value?.list || [])
  })
}