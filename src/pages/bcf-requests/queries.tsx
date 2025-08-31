import { requestsKeys} from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { getCashRequests } from "@/services/request.service";
import { useQuery} from "@tanstack/react-query";
import dayjs from "dayjs";

export function useGetRequests() {
  const { getParam } = useParamsHelper();

  const params = {
    requestType: "BCF",
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
    fromDate: getParam("fromDate") ?? dayjs(new Date()).format("YYYY-MM-DD"),
    toDate: getParam("toDate") ?? dayjs(new Date()).format("YYYY-MM-DD"),
    search: getParam("search") ?? undefined,
    status: getParam("status") ?? undefined,
  };

  return useQuery({
    queryKey: requestsKeys.list(JSON.stringify(params)),
    queryFn: () => getCashRequests(params),
    select: (data) => data.data,
  });
}