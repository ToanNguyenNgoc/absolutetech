import { TransactionApi } from "@/api";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useGetTransactions(params, options) {
  const queryKey = computed(() => ['transactions', { ...params }]);
  const query = useQuery({
    queryKey,
    queryFn: () => TransactionApi.get({ ...params }),
    ...options
  });

  return Object.assign(query, {
    response: computed(() => query.data.value?.data),
    transactions: computed(() => query.data.value?.data?.list || []),
  })
}