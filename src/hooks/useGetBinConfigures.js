import { BinApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetBinConfigures(params) {
  const { data } = useQuery({
    queryKey: ['bin-configures', params],
    queryFn: () => BinApi.getBinConfigures(params),
  });

  const bin_configures = computed(() => data.value?.data?.list || []);
  return bin_configures;
}