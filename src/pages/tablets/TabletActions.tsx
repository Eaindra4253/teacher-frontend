import { tabletCreateSchema } from "@/configs/schema";
import { ActionIcon, Button, Center, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useCreateTablet, useDeleteTablet } from "./queries";
import { z } from "zod";
import { TabletForm } from "./Form";
import { modals } from "@mantine/modals";

export function AddTabletButton() {
  const [opened, { open, close }] = useDisclosure();
  const { mutateAsync, isPending } = useCreateTablet();

  const handleSubmit = (values: z.infer<typeof tabletCreateSchema>) => {
    mutateAsync({
      ...values,
    });
    close();
  };

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus />} radius="md" size="xs">
        Add Tablet
      </Button>
      <Modal opened={opened} onClose={close} title="Add Tablet">
        <TabletForm handleSubmit={handleSubmit} isPending={isPending} />
      </Modal>
    </>
  );
}

export function TabletDeleteButton({ id }: { id: number }) {
  const { mutateAsync: deleteTablet } = useDeleteTablet();

  const confirmDialog = () => {
    modals.openConfirmModal({
      title: `Delete Tablet`,
      children: `Are you sure you want to delete this tablet?`,
      labels: {
        confirm: "Delete",
        cancel: "Cancel",
      },
      onConfirm: () => {
        deleteTablet(id).then(() => {
          modals.closeAll();
        });
      },
    });
  };

  return (
    <Center>
      <ActionIcon color="red" onClick={confirmDialog} variant="transparent">
        <IconTrash size={20} />
      </ActionIcon>
    </Center>
  );
}
