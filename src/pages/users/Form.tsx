import { userCreateSchema, userUpdateSchema } from "@/configs/schema";
import {
  Stack,
  TextInput,
  Group,
  Button,
  Select,
  Modal,
  ActionIcon,
  PasswordInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconLock,
  IconPlus,
} from "@tabler/icons-react";
import { z } from "zod";
import { useCreateUser, useUpdateUser } from "./queries";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { ERROR_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "@/configs/constants";

export function UserDisableForm({ data }: { data: User }) {
  const { mutateAsync } = useUpdateUser(data.id);

  const status = data.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";

  const confirmDialog = () => {
    modals.openConfirmModal({
      title: `${status} User`,
      children: `Are you sure you want to ${status} this user?`,
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

export function UserPasswordChangeForm({ data }: { data: User }) {
  const [opened, { close, open }] = useDisclosure();
  const { isPending, mutateAsync } = useUpdateUser(data.id);

  const form = useForm<{ password: string }>({
    initialValues: {
      password: "",
    },
    validate: ({ password }) => ({
      password: password.length ? undefined : "Enter new password",
    }),
  });

  return (
    <>
      <ActionIcon
        onClick={open}
        size="sm"
        color={WARNING_COLOR}
        variant="transparent"
        title="Change Password"
      >
        <IconLock size={20} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={close}
        title={`Change Password for User "${data?.username}"`}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            mutateAsync(values).then(() => {
              form.reset();
              close();
            })
          )}
        >
          <Stack gap="sm">
            <PasswordInput
              label="New Password"
              placeholder="Enter New Password"
              {...form.getInputProps("password")}
            />
            <Group gap="xs" justify="end">
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button loading={isPending} type="submit">
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export function UserCreateForm() {
  const [opened, { close, open }] = useDisclosure();
  const { mutateAsync, isPending } = useCreateUser();

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus />} radius="md" size="xs">
        Add User
      </Button>
      <Modal opened={opened} onClose={close} title="Add User">
        <UserForm
          isPending={isPending}
          handleSubmit={(values) => mutateAsync(values).then(close)}
        />
      </Modal>
    </>
  );
}

export function UserUpdateForm({ data }: { data: User }) {
  const [opened, { close, open }] = useDisclosure();
  const { isPending, mutateAsync } = useUpdateUser(data.id);

  return (
    <>
      <ActionIcon
        size="sm"
        variant="transparent"
        onClick={open}
        title="Update User"
      >
        <IconEdit size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Update User">
        <UserForm
          isPending={isPending}
          initialValues={{
            email: data.email,
            username: data.username,
            department: data.department ?? "",
            role: data.role,
            password: data.password,
          }}
          handleSubmit={(values) => mutateAsync(values).then(close)}
        />
      </Modal>
    </>
  );
}

type UserFormProps = {
  isPending: boolean;
  initialValues?: z.infer<typeof userCreateSchema>;
  handleSubmit: (values: z.infer<typeof userCreateSchema>) => Promise<void>;
};

export function UserForm({
  isPending,
  initialValues,
  handleSubmit,
}: UserFormProps) {
  const form = useForm<z.infer<typeof userCreateSchema>>({
    initialValues: initialValues ?? {
      username: "",
      email: "",
      role: "ADMIN",
      password: "",
      department: "",
    },
    validate: zodResolver(initialValues ? userUpdateSchema : userCreateSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        handleSubmit(values).then(() => form.reset())
      )}
    >
      <Stack>
        <TextInput
          label="Username"
          placeholder="Enter Username"
          {...form.getInputProps("username")}
        />
        <TextInput
          autoComplete="off"
          label="Email"
          placeholder="Enter Email"
          {...form.getInputProps("email")}
        />
        <Select
          searchable={false}
          label="Role"
          placeholder="Select Role"
          clearable
          data={[
            {
              label: "Moderator",
              value: "MODERATOR",
            },
            {
              label: "Admin",
              value: "ADMIN",
            },
            {
              label: "Audit",
              value: "AUDIT"
            }
          ]}
          {...form.getInputProps("role")}
        />
        <TextInput
          label="Department"
          placeholder="Enter Department"
          {...form.getInputProps("department")}
        />
        {!initialValues && (
          <PasswordInput
            autoComplete="new-password"
            label="Password"
            placeholder="Enter Password"
            {...form.getInputProps("password")}
          />
        )}
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
