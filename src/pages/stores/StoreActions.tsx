import { storeCreateSchema } from "@/configs/schema";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useAddRequest, useCreateStore, useUpdateStore } from "./queries";
import { z } from "zod";
import { StoreForm } from "./Form";
import { useForm } from "@mantine/form";

export function AddStoreButton() {
  const [opened, { open, close }] = useDisclosure();
  const { mutateAsync, isPending } = useCreateStore();

  const handleSubmit = (values: z.infer<typeof storeCreateSchema>) => {
    mutateAsync({
      ...values,
      merchantId: Number(values.merchantId),
    });
    close();
  };

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus />} radius="md" size="xs">
        Add Store
      </Button>
      <Modal opened={opened} onClose={close} title="Add Store">
        <StoreForm handleSubmit={handleSubmit} isPending={isPending} />
      </Modal>
    </>
  );
}

export function AddRequestModal({ store }: { store: Store }) {
  const [opened, { close, open }] = useDisclosure();
  const { isPending, mutateAsync } = useAddRequest();

  const form = useForm({
    initialValues: {
      storeCode: store.outletName,
      shift: "",
      amount: 0,
    },
    validate: {
      shift: (value) => (!value ? "Please Enter Shift" : undefined),
      amount: (value) => (!value ? "Please Enter Amount" : undefined),
    },
  });

  const handleSubmit = (values: Record<string, unknown>) => {
    mutateAsync(values);
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
              label="Store Code"
              disabled
              {...form.getInputProps("storeCode")}
            />
            <TextInput
              label="Shift"
              placeholder="Enter Shift"
              {...form.getInputProps("shift")}
            />
            <NumberInput
              label="Amount"
              placeholder="Enter Amount"
              {...form.getInputProps("amount")}
            />
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

export function EditStoreButton({ store }: { store: Store }) {
  const [opened, { close, open }] = useDisclosure();
  const { mutateAsync, isPending } = useUpdateStore(store.id);

  const handleSubmit = (values: z.infer<typeof storeCreateSchema>) => {
    mutateAsync({
      ...values,
      merchantId: Number(values.merchantId),
    });
    close();
  };

  return (
    <>
      <ActionIcon size="sm" variant="transparent" onClick={open}>
        <IconEdit size={20} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Edit Store">
        <StoreForm
          initialValues={{
            address: store.address,
            ddmName: store.ddmName,
            ddmPhone: store.ddmPhone,
            outletName: store.outletName,
            outletType: store.outletType,
            merchantId: store.merchantId?.toString(),
          }}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </Modal>
    </>
  );
}
