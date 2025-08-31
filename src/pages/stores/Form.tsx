import { AgentSelect } from "@/components/core/selects/AgentSelect";
import { storeCreateSchema } from "@/configs/schema";
import {
  Stack,
  TextInput,
  Flex,
  RadioGroup,
  Radio,
  Textarea,
  Group,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { z } from "zod";

type StoreFormProps = {
  isPending: boolean;
  initialValues?: z.infer<typeof storeCreateSchema>;
  handleSubmit: (values: z.infer<typeof storeCreateSchema>) => void;
};

export function StoreForm({
  isPending,
  initialValues,
  handleSubmit,
}: StoreFormProps) {
  const form = useForm<z.infer<typeof storeCreateSchema>>({
    initialValues: initialValues ?? {
      outletName: "",
      outletType: "GNG",
      ddmName: "",
      ddmPhone: "",
      address: "",
      merchantId: null,
    },
    validate: zodResolver(storeCreateSchema),
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
          label="Outlet Name"
          placeholder="Enter Outlet Name"
          {...form.getInputProps("outletName")}
        />
        <Flex gap="sm">
          <TextInput
            flex={1}
            label="DDM Name"
            placeholder="Enter DDM Name"
            {...form.getInputProps("ddmName")}
          />
          <TextInput
            flex={1}
            label="DDM Phone"
            placeholder="Enter Outlet Name"
            {...form.getInputProps("ddmPhone")}
          />
        </Flex>
        <RadioGroup label="Type" {...form.getInputProps("outletType")}>
          <Flex gap="sm" mt="4px">
            <Radio label="GNG" value="GNG" />
            <Radio label="Capital" value="CAPITAL" />
          </Flex>
        </RadioGroup>
        <AgentSelect {...form.getInputProps("merchantId")} />
        <Textarea
          label="Address"
          placeholder="Enter Address"
          {...form.getInputProps("address")}
        />
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
