import { merchantsKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import {
  createMerchant,
  getMerchants,
  updateMerchant,
} from "@/services/merchant.service";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetMerchants() {
  const { getParam } = useParamsHelper();

  const params = {
    search: getParam("search") ?? undefined,
    merchantType: getParam("merchantType") ?? undefined,
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
  };

  return useQuery({
    queryKey: merchantsKeys.list(JSON.stringify(params)),
    queryFn: async () => getMerchants(params),
    select: (data) => data.data,
  });
}

export function useCreateMerchant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => createMerchant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantsKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Merchant Created Successfully",
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) =>
      notifications.show({
        color: "red",
        title: "Error",
        icon: <IconCheck />,
        message: error.response?.data.message,
      }),
  });
}

export function useUpdateMerchant(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) =>
      updateMerchant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantsKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Merchant Updated Successfully",
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) =>
      notifications.show({
        color: "red",
        title: "Error",
        icon: <IconCheck />,
        message: error.response?.data.message,
      }),
  });
}
