import { merchantsKeys } from "@/configs/queryKeys";
import { getAllLocations } from "@/services/location.service";
import { getMerchants } from "@/services/merchant.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAgentSelect() {
  const params = {
    page: 1,
    limit: 10000,
    merchantType: "SUPER_AGENT",
  };
  return useQuery({
    queryKey: merchantsKeys.list(JSON.stringify(params)),
    queryFn: async () => getMerchants(params),
    select: (data) =>
      data.data.data?.map((agent) => ({
        key: agent.id,
        value: `${agent.id}`,
        label: `${agent.merchantName} - ${agent.phone}`,
        option: agent.phone,
      })),
  });
}

export function useGetAllLocations() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: () => getAllLocations(),
    select: (data) =>
      data.data?.data.map((district) => ({
        value: district.id.toString(),
        label: district.name,
        townships: district.townships.map((township) => ({
          value: township.id.toString(),
          label: township.name,
        })),
      })),
  });
}
