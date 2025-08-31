import api from "@/configs/api";

export function getAllLocations() {
  return api.get<ApiResponseList<Locations>>("/locations/get-all");
}
