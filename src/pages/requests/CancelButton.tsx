import { Button, Group, Stack, Textarea } from "@mantine/core";
import { FormErrors, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconCancel } from "@tabler/icons-react";
import { useCancelRequest } from "./queries";

function CancelForm({ id }: { id: number }) {
  const { mutate, isPending } = useCancelRequest();

  const form = useForm({
    initialValues: {
      remark: "",
    },
    validate: (values) => {
      const errors: FormErrors = {};
      if (!values.remark) {
        errors.remark = "Remark is required";
      }

      return errors;
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        mutate({ id, remark: values.remark });
        modals.closeAll();
      })}
    >
      <Stack>
        <Textarea {...form.getInputProps("remark")} label="Remark" rows={4} />
        <Group justify="end">
          <Button variant="outline" onClick={() => modals.closeAll()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} loading={isPending}>
            Confirm
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function CancelButton({ id }: { id: number }) {
  return (
    <Button
      color="red"
      title="Cancel Request"
      size="xs"
      leftSection={<IconCancel size={16} />}
      onClick={() => {
        modals.open({
          id: "cancel-request",
          title: "Are you sure you want to cancel this request?",
          children: <CancelForm id={id} />,
        });
      }}
    >
      Cancel
    </Button>
  );
}
