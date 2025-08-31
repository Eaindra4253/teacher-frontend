import api from "@/configs/api";

export function getTablets(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<Tablet>>("/tablets", { params });
}

export function createTablet(data: Record<string, unknown>) {
  return api.post("/tablets", data);
}

export function deleteTablet(id: number) {
  return api.delete(`/tablets/${id}`);
}

export function getAllTablets() {
  return api.get<ApiResponseList<Tablet>>("/tablets");
}
