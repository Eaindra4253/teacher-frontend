import { useState } from 'react';
import {
  Button,
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Modal,
  TextInput,
  Textarea,
  Group,
  rem,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconCalendarPlus, IconEdit, IconTrash } from '@tabler/icons-react';

const initialEvents = [
  { id: 1, title: 'Math 101 Lecture', time: '10:00 AM', date: '2025-08-25', description: 'Algebra fundamentals.' },
  { id: 2, title: 'Physics Lab', time: '02:00 PM', date: '2025-08-26', description: 'Experiment on gravity.' },
];

export default function SchedulesPage() {
  const [events, setEvents] = useState(initialEvents);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const form = useForm({
    initialValues: {
      title: '',
      time: '',
      date: '',
      description: '',
    },
    validate: {
      title: (value) => (value.trim() ? null : 'Event title is required'),
      time: (value) => (value.trim() ? null : 'Time is required'),
      date: (value) => (value.trim() ? null : 'Date is required'),
    },
  });

  const handleAddOrUpdateEvent = (values: any) => {
    if (editingEvent) {
      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? { ...values, id: editingEvent.id } : event
        )
      );
    } else {
      const newEvent = { ...values, id: events.length + 1 };
      setEvents([...events, newEvent]);
    }
    form.reset();
    setEditingEvent(null);
    close();
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    form.setValues(event);
    open();
  };

  const handleDelete = (id: any) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const eventsList = events.map((event) => (
    <Paper key={event.id} withBorder shadow="sm" p="sm" radius="md" my="sm">
      <Group justify="space-between">
        <div>
          <Text fw={500}>{event.title}</Text>
          <Text size="sm" c="dimmed">{event.time} on {event.date}</Text>
          {event.description && <Text size="sm" mt="xs">{event.description}</Text>}
        </div>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(event)}
            title="Edit schedule"
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(event.id)}
            title="Delete schedule"
          >
            <IconTrash style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  ));

  return (
    <Container size="lg" pt="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Schedules</Title>
        <Button
          onClick={() => {
            setEditingEvent(null);
            form.reset();
            open();
          }}
          leftSection={<IconCalendarPlus size={16} />}
        >
          Add New Schedule
        </Button>
      </Group>

      <Paper withBorder shadow="md" p="lg" radius="md">
        <Title order={3} mb="md">Upcoming Events</Title>
        <Stack>
          {eventsList.length > 0 ? (
            eventsList
          ) : (
            <Text c="dimmed" ta="center">No schedules found.</Text>
          )}
        </Stack>
      </Paper>

      {/* Modal for adding/editing events */}
      <Modal opened={opened} onClose={close} title={editingEvent ? "Update Schedule" : "Create Schedule"}>
        <form onSubmit={form.onSubmit(handleAddOrUpdateEvent)}>
          <Stack>
            <TextInput label="Event Title" placeholder="e.g., Math Class" {...form.getInputProps('title')} />
            <TextInput label="Date" type="date" {...form.getInputProps('date')} />
            <TextInput label="Time" type="time" {...form.getInputProps('time')} />
            <Textarea label="Description" placeholder="e.g., Chapter 1 review" {...form.getInputProps('description')} />
            <Button type="submit" mt="md">
              {editingEvent ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}