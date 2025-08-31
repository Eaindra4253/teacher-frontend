import { requestsKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { generateReport } from "@/services/report.service";
import { cancelRequest, getCashRequests } from "@/services/request.service";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

export function useGenerateRequestReport() {
  const { getParam } = useParamsHelper();

  const fromDate = getParam("fromDate") ?? dayjs(new Date()).toDate();
  const toDate = getParam("toDate") ?? dayjs(new Date()).toDate();
  const status = getParam("status") ?? undefined;

  return useMutation({
    mutationFn: () =>
      generateReport({
        fromDate,
        toDate,
        status,
        reportType: "CASH_REQUEST_REPORT",
      }),
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Cannot download report",
        color: "red",
      });
    },
  });
}

export function useGetRequests() {
  const { getParam } = useParamsHelper();

  const params = {
    requestType: "STORE",
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

export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; remark: string }) => cancelRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.all });

      notifications.show({
        title: "Success",
        message: "Request cancelled successfully",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Cannot cancel request",
        color: "red",
      });
    },
  });
}
