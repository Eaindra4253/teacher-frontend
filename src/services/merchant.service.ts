import api from "@/configs/api";

export function getMerchants(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<Merchant>>("/merchant", { params });
}

export function createMerchant(data: Record<string, unknown>) {
  return api.post("/merchant", data);
}

export function updateMerchant(id: number, data: Record<string, unknown>) {
  return api.put(`/merchant/${id}`, data);
}
