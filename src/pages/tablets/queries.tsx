import { tabletKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import {
  createTablet,
  deleteTablet,
  getAllTablets,
  getTablets,
} from "@/services/tablet.service";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetTablets() {
  const { getParam } = useParamsHelper();

  const params = {
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
    search: getParam("search") ?? undefined,
  };

  return useQuery({
    queryKey: tabletKeys.list(JSON.stringify(params)),
    queryFn: () => getTablets(params),
    select: (data) => data.data,
  });
}

export function useCreateTablet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => createTablet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tabletKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Tablet Created Successfully",
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

export function useDeleteTablet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTablet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tabletKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "Tablet Delete Successfully",
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

export function useGetAllTablets() {
  return useQuery({
    queryKey: ["tablets"],
    queryFn: () => getAllTablets(),
    select: (data) =>
      data.data?.data.map((tablet) => ({
        value: tablet.tabletName,
        label: tablet.tabletName,
      })),
  });
}