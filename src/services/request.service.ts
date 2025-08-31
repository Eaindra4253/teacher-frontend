import api from "@/configs/api";

export function getCashRequests(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<CashRequest>>("/cash-request", { params });
}

export function storeRequest(data: Record<string, unknown>) {
  return api.post<CashRequest>(`/cash-request`, data);
}

export function cancelRequest({ id, remark }: { id: number; remark: string }) {
  return api.put(`/cash-request/${id}`, {
    status: "CANCELLED",
    remark,
  });
}
