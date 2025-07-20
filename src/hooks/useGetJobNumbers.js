import { getJobNumbers } from "@/api/jobnumber";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetJobNumbers(){
  const {data} = useQuery({
    queryKey:['job-numbers'],
    queryFn:() => getJobNumbers(1, 1000)
  })

  const job_numbers = computed(() => data.value?.data?.data?.list || []);
  return job_numbers;
}