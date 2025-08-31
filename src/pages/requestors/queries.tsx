import { CopyText } from "@/components/commons/CopyText";
import { requestorKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import {
  createRequestor,
  getRequestors,
  requestorRequest,
  updateRequestor,
} from "@/services/requestor.service";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetRequestors() {
  const { getParam } = useParamsHelper();

  const params = {
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
    search: getParam("search") ?? undefined,
    outletType: getParam("outletType") ?? undefined,
  };

  return useQuery({
    queryKey: requestorKeys.list(JSON.stringify(params)),
    queryFn: () => getRequestors(params),
    select: (data) => data.data,
  });
}

export function useCreateRequestor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => createRequestor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestorKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Requestor Created Successfully",
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

export function useUpdateRequestor(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) =>
      updateRequestor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestorKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Requestor Updated Successfully",
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
    mutationFn: async (data: Record<string, unknown>) => requestorRequest(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: requestorKeys.all });
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
                Merchant Name
              </Text>
              <Text>{response.data?.merchant?.merchantName}</Text>
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
