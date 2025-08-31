import { requestorCreateSchema } from "@/configs/schema";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import {
  useAddRequest,
  useCreateRequestor,
  useUpdateRequestor,
} from "./queries";
import { RequestorForm } from "./Form";
import { useForm } from "@mantine/form";
import { AgentSelect } from "@/components/core/selects/AgentSelect";
import { TabletSelect } from "@/components/core/selects/TabletSelect";

export function AddRequestorButton() {
  const [opened, { open, close }] = useDisclosure();
  const { mutateAsync, isPending } = useCreateRequestor();

  const handleSubmit = (values: z.infer<typeof requestorCreateSchema>) => {
    mutateAsync({
      ...values,
    });
    close();
  };

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus />} radius="md" size="xs">
        Add Requestor
      </Button>
      <Modal opened={opened} onClose={close} title="Add Requestor">
        <RequestorForm handleSubmit={handleSubmit} isPending={isPending} />
      </Modal>
    </>
  );
}

export function EditRequestorButton({ requestor }: { requestor: Requestor }) {
  const [opened, { close, open }] = useDisclosure();
  const { mutateAsync, isPending } = useUpdateRequestor(requestor.id);

  const handleSubmit = (values: z.infer<typeof requestorCreateSchema>) => {
    mutateAsync({
      ...values,
    });
    close();
  };

  return (
    <>
      <ActionIcon size="sm" variant="transparent" onClick={open}>
        <IconEdit size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Edit Requestor">
        <RequestorForm
          initialValues={{
            username: requestor.username,
            phone: requestor.phone,
            type: requestor.type,
          }}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </Modal>
    </>
  );
}

export function AddRequestModal({ requestor }: { requestor: Requestor }) {
  const [opened, { close, open }] = useDisclosure();
  const { isPending, mutateAsync } = useAddRequest();

  const form = useForm({
    initialValues: {
      requestorId: requestor.id,
      requestorName: requestor.username,
      amount: 0,
      merchantId: 0,
      tabletName: "",
    },
    validate: {
      amount: (value) => (!value ? "Please Enter Amount" : undefined),
    },
  });

  const handleSubmit = (values: Record<string, unknown>) => {
    mutateAsync({
      requestorId: values.requestorId,
      amount: Number(values.amount),
      merchantId: Number(values.merchantId),
      tabletName: form.values.tabletName,
    });
    close();
  };

  return (
    <>
      <Button
        size="xs"
        onClick={open}
        title="Add Cash Request"
        leftSection={<IconPlus />}
      >
        Cash Request
      </Button>
      <Modal opened={opened} onClose={close} title="Add Cash Request">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
             <TextInput
              label="Requestor Name"
              disabled
              {...form.getInputProps("requestorName")}
            />
            <TextInput
              label="Amount"
              placeholder="Enter Amount"
              {...form.getInputProps("amount")}
            />
            <AgentSelect {...form.getInputProps("merchantId")} />
            <TabletSelect {...form.getInputProps("tabletName")} />
            <Group justify="right">
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button disabled={isPending} loading={isPending} type="submit">
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
