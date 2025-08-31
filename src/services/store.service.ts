import api from "@/configs/api";

export function getStores(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<Store>>("/stores", { params });
}

export function updateStore(id: number, data: Record<string, unknown>) {
  return api.put(`/stores/${id}`, data);
}

export function createStore(data: Record<string, unknown>) {
  return api.post("/stores", data);
}
