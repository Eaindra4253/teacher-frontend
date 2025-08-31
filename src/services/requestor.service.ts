import api from "@/configs/api";

export function getRequestors(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<Requestor>>("/requestor", { params });
}

export function updateRequestor(id: number, data: Record<string, unknown>) {
  return api.put(`/requestor/${id}`, data);
}

export function createRequestor(data: Record<string, unknown>) {
  return api.post("/requestor", data);
}

export function requestorRequest(data: Record<string, unknown>) {
  return api.post<CashRequest>(`/cash-request/requestor-request `, data);
}
