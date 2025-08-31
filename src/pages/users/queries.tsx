import { userKeys } from "@/configs/queryKeys";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { createUser, getUsers, updateUser } from "@/services/user.service";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useGetUsers() {
  const { getParam } = useParamsHelper();

  const params = {
    page: getParam("page") ?? 1,
    limit: getParam("limit") ?? 10,
    search: getParam("search") ?? undefined,
    outletType: getParam("outletType") ?? undefined,
  };

  return useQuery({
    queryKey: userKeys.list(JSON.stringify(params)),
    queryFn: () => getUsers(params),
    select: (data) => data.data,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "User Created Successfully",
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

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      notifications.show({
        color: "green",
        title: "Success",
        icon: <IconCheck />,
        message: "User Updated Successfully",
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
