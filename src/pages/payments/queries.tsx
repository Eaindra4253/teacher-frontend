import { historyKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { getHistory } from "@/services/payment-history.service";
import { useQuery } from "@tanstack/react-query";

export function useGetHistory() {
  const { getParam } = useParamsHelper();

  const params = {
    search: getParam("search") ?? undefined,
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
  };

  return useQuery({
    queryKey: historyKeys.list(JSON.stringify(params)),
    queryFn: async () => getHistory(params),
    select: (data) => data.data,
  });
}
