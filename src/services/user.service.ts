import api from "@/configs/api";

export function getUsers(params?: Record<string, unknown>) {
  return api.get<ApiResponseList<User>>("/admin/user", { params });
}

export function createUser(data: Record<string, unknown>) {
  return api.post("/admin/user", data);
}

export function updateUser(id: number, data: Record<string, unknown>) {
  return api.put(`/admin/user/${id}`, data);
}
