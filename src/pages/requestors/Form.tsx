import { ReqeustorTypeSelect } from "@/components/core/selects/RequestorTypeSelect";
import { ERROR_COLOR, SUCCESS_COLOR } from "@/configs/constants";
import { requestorCreateSchema } from "@/configs/schema";
import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import {
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconPlus,
} from "@tabler/icons-react";
import { z } from "zod";
import { useUpdateRequestor } from "./queries";

type ReqeustorFormProps = {
  isPending: boolean;
  initialValues?: z.infer<typeof requestorCreateSchema>;
  handleSubmit: (values: z.infer<typeof requestorCreateSchema>) => void;
};

export function RequestorForm({
  isPending,
  initialValues,
  handleSubmit,
}: ReqeustorFormProps) {
  const form = useForm<z.infer<typeof requestorCreateSchema>>({
    initialValues: initialValues ?? {
      username: "",
      type: "BCF",
      phone: "",
    },
    validate: zodResolver(requestorCreateSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
        form.reset();
      })}
    >
      <Stack>
        <TextInput
          label="User Name"
          placeholder="Enter User Name"
          {...form.getInputProps("username")}
        />
        <TextInput
          flex={1}
          label="Phone"
          placeholder="Phone"
          {...form.getInputProps("phone")}
        />
        <ReqeustorTypeSelect {...form.getInputProps("type")} />
        <Group justify="flex-end" gap="sm">
          <Button
            loading={isPending}
            disabled={isPending}
            leftSection={initialValues ? <IconEdit /> : <IconPlus />}
            type="submit"
          >
            {initialValues ? "Update" : "Add"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function RequestorDisableForm({ data }: { data: Requestor }) {
  const { mutateAsync } = useUpdateRequestor(data.id);

  const status = data.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";

  const confirmDialog = () => {
    modals.openConfirmModal({
      title: `${status} Reqeustor`,
      children: `Are you sure you want to ${status} this Requestor?`,
      labels: {
        confirm: status,
        cancel: "Cancel",
      },
      onConfirm: () => {
        mutateAsync({ status }).then(() => {
          modals.closeAll();
        });
      },
    });
  };

  return (
    <>
      <ActionIcon
        size="sm"
        color={data?.status === "ACTIVE" ? ERROR_COLOR : SUCCESS_COLOR}
        variant="transparent"
        onClick={confirmDialog}
        title={`${status} User`}
      >
        {data?.status === "ACTIVE" ? (
          <IconCircleX size={20} />
        ) : (
          <IconCircleCheck size={20} />
        )}
      </ActionIcon>
    </>
  );
}
