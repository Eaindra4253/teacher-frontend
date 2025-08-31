import { CopyText } from "@/components/commons/CopyText";
import { requestsKeys, storesKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { storeRequest } from "@/services/request.service";
import { createStore, getStores, updateStore } from "@/services/store.service";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetStores() {
  const { getParam } = useParamsHelper();

  const params = {
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
    search: getParam("search") ?? undefined,
    outletType: getParam("outletType") ?? undefined,
  };

  return useQuery({
    queryKey: storesKeys.list(JSON.stringify(params)),
    queryFn: () => getStores(params),
    select: (data) => data.data,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storesKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Store Created Successfully",
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) =>
      notifications.show({
        color: "red",
        title: "Error",
        icon: <IconX />,
        message: error.response?.data.message,
      }),
  });
}

export function useUpdateStore(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storesKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Store Updated Successfully",
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) =>
      notifications.show({
        color: "red",
        title: "Error",
        icon: <IconX />,
        message: error.response?.data.message,
      }),
  });
}

export function useAddRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => storeRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.all });
      modals.open({
        title: "Requested Successfully",
        children: (
          <Stack gap="xs">
            <Flex justify="space-between">
              <Text fw="bolder" fz="sm">
                Request Code
              </Text>
              <CopyText>{response.data?.requestCode}</CopyText>
            </Flex>
            <Flex justify="space-between">
              <Text fw="bolder" fz="sm">
                Outlet Name
              </Text>
              <Text>{response.data?.store?.outletName}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fw="bolder" fz="sm">
                Amount
              </Text>
              <Text>{response.data?.amount}</Text>
            </Flex>
          </Stack>
        ),
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) =>
      notifications.show({
        color: "red",
        title: "Error",
        icon: <IconX />,
        message: error.response?.data.message,
      }),
  });
}
