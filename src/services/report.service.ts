import api from "@/configs/api";

export function generateReport(params?: Record<string, unknown>) {
  return api.post("/reports/generate", params ?? {});
}

export function downloadReport(id: number, params?: Record<string, unknown>) {
  return api.get(`/reports/download/${id}`, {
    params,
    responseType: "blob",
  });
}
export function getReports(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<Reports>>("/reports", { params });
}
