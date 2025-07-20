import { BinApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetBins(params){
  const {data} = useQuery({
    queryKey:['bins', params],
    queryFn:() => BinApi.getBins(params)
  })

  const bins = computed(() => data.value?.data?.list || []);
  return bins
}