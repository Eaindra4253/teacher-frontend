import api from "@/configs/api";

export function getHistory(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<History>>("/payment-request", { params });
}
