import { DistrictSelect } from "@/components/core/selects/DistrictSelect";
import { merchantCreateSchema } from "@/configs/schema";
import {
  ActionIcon,
  Button,
  ComboboxData,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";
import { useCreateMerchant, useUpdateMerchant } from "./queries";

export function AddMerchantButton() {
  const [opened, { open, close }] = useDisclosure();
  const { mutateAsync, isPending } = useCreateMerchant();

  const handleSubmit = (values: Record<string, unknown>) => {
    mutateAsync(values);
    close();
  };

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus />} radius="md" size="xs">
        Add Merchant
      </Button>
      <Modal opened={opened} onClose={close} title="Add Merchant">
        <MerchantForm handleSubmit={handleSubmit} isPending={isPending} />
      </Modal>
    </>
  );
}

export function EditMerchantButton({ agent }: { agent: Merchant }) {
  const [opened, { open, close }] = useDisclosure();
  const { mutateAsync, isPending } = useUpdateMerchant(agent.id);

  const handleSubmit = (values: Record<string, unknown>) => {
    mutateAsync(values);
    close();
  };

  return (
    <>
      <ActionIcon onClick={open} variant="transparent" size="sm">
        <IconEdit />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Update Merchant">
        <MerchantForm
          initialValues={{
            merchantName: agent.merchantName,
            merchantType: agent.merchantType,
            phone: agent.phone,
            address: agent.address,
            districtId: agent.districtId?.toString() ?? null,
            townshipId:
              agent.merchantTownships?.map(
                ({ township }) => `${township.id}`
              ) ?? [],
          }}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </Modal>
    </>
  );
}

type MerchantFormProps = {
  isPending: boolean;
  initialValues?: z.infer<typeof merchantCreateSchema>;
  handleSubmit: (values: Record<string, unknown>) => void;
};

export function MerchantForm({
  isPending,
  initialValues,
  handleSubmit,
}: MerchantFormProps) {
  const [townships, setTownships] = useState<ComboboxData>([]);

  const form = useForm<z.infer<typeof merchantCreateSchema>>({
    initialValues: initialValues ?? {
      merchantName: "",
      merchantType: "",
      phone: "",
      townshipId: [],
      districtId: null,
      address: "",
    },
    validate: zodResolver(merchantCreateSchema),
  });

  const onSubmit = ({
    districtId,
    townshipId,
    ...values
  }: z.infer<typeof merchantCreateSchema>) => {
    handleSubmit({
      ...values,
      townshipIds: townshipId?.length
        ? townshipId.map((id) => Number(id))
        : undefined,
      districtId: (districtId && Number(districtId)) ?? undefined,
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <TextInput
          label="Merchant Name"
          placeholder="Enter Merchant Name"
          {...form.getInputProps("merchantName")}
        />
        <TextInput
          label="Phone"
          placeholder="Enter Phone"
          {...form.getInputProps("phone")}
        />
        <Select
          clearable
          label="Merchant Type"
          placeholder="Enter Merchant Type"
          data={[
            {
              label: "Super Agent",
              value: "SUPER_AGENT",
            },
            {
              label: "Agent Merchant",
              value: "AGENT_MERCHANT",
            },
          ]}
          {...form.getInputProps("merchantType")}
        />
        {form.values.merchantType === "SUPER_AGENT" && (
          <>
            <DistrictSelect
              label="District"
              placeholder="Select District"
              {...form.getInputProps("districtId")}
              setTownships={setTownships}
            />
            <MultiSelect
              clearable
              label="Township"
              data={townships ?? []}
              placeholder="Please select Township"
              {...form.getInputProps("townshipId")}
            />
            <TextInput
              label="Address"
              placeholder="Enter Address"
              {...form.getInputProps("address")}
            />
          </>
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
