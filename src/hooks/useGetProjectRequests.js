import { ProjectRequest } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetProjectRequests(params, options) {
  const queryKey = computed(() => ['job-numbers', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => ProjectRequest.get(params),
    ...options,
  });

  const response = computed(() => query.data.value?.data);
  return Object.assign(query, {
    response,
    project_requests: computed(() => response.value?.list || [])
  })
}