import { tabletCreateSchema } from "@/configs/schema";
import { Stack, TextInput, Group, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { z } from "zod";

type TabletFormProps = {
  isPending: boolean;
  initialValues?: z.infer<typeof tabletCreateSchema>;
  handleSubmit: (values: z.infer<typeof tabletCreateSchema>) => void;
};

export function TabletForm({
  isPending,
  initialValues,
  handleSubmit,
}: TabletFormProps) {
  const form = useForm<z.infer<typeof tabletCreateSchema>>({
    initialValues: initialValues ?? {
      tabletName: "",
    },
    validate: zodResolver(tabletCreateSchema),
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
          label="Name"
          placeholder="Enter Tablet Name"
          {...form.getInputProps("tabletName")}
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
