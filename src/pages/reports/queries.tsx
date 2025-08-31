import { reportsKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import {
  downloadReport,
  generateReport,
  getReports,
} from "@/services/report.service";
import { downloadFile } from "@/utils/downloadFile";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

export function useDownloadReport() {
  return useMutation({
    mutationFn: ({ id }: { id: number; reportType: string}) =>
      downloadReport(id),
    onSuccess: (response, { reportType }) =>
      downloadFile(response.data, `${reportType}.xlsx`),
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Cannot download report",
        color: "red",
      });
    },
  });
}

export function useGetReports() {
  const { getParam } = useParamsHelper();

  const params = {
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
    reportType: getParam("reportType") ?? undefined,
  };

  return useQuery({
    queryKey: reportsKeys.list(JSON.stringify(params)),
    queryFn: () => getReports(params),
    select: (data) => data.data,
  });
}

export function useGenerateReport(reportType: string, requestType: string) {
  const { getParam } = useParamsHelper();

  const merchantType = getParam("merchantType") ?? undefined;
  const outletType = getParam("outletType") ?? undefined;
  const fromDate = getParam("fromDate") ?? dayjs(new Date()).toDate();
  const toDate = getParam("toDate") ?? dayjs(new Date()).toDate();
  const status = getParam("status") ?? undefined;

  return useMutation({
    mutationFn: () => {
      const payload: Record<string, unknown> = {
        reportType,
        merchantType,
        outletType,
        fromDate,
        toDate,
        status,
      };

      if (requestType !== "") {
        payload.requestType = requestType;
      }

      return generateReport(payload);
    },
    onError: () => {
      notifications.show({
        title: "Error",
        message: "Cannot download report",
        color: "red",
      });
    },
  });
}
