import { useState } from 'react';
import {
  Button,
  Table,
  Group,
  ActionIcon,
  Container,
  Title,
  Modal,
  rem,
  TextInput,
  Text,
  Paper,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';

// Dummy data for demonstration
const initialClasses = [
  { id: 1, name: 'Web Development 101', teacher: 'Daw Su Su', students: 25 },
  { id: 2, name: 'Data Science Fundamentals', teacher: 'U Aung Kyaw', students: 18 },
  { id: 3, name: 'Mobile App Design', teacher: 'Daw Mya Mya', students: 30 },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState(initialClasses);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingClass, setEditingClass] = useState(null);

  const form = useForm({
    initialValues: {
      name: '',
      teacher: '',
      students: 0,
    },
    validate: {
      name: (value) => (value.trim() ? null : 'Class name is required'),
      teacher: (value) => (value.trim() ? null : 'Teacher name is required'),
    },
  });

  const handleAddOrUpdateClass = (values: any) => {
    if (editingClass) {
      setClasses(
        classes.map((cls) => (cls.id === editingClass.id ? { ...values, id: editingClass.id } : cls))
      );
    } else {
      const newClass = { ...values, id: classes.length + 1 };
      setClasses([...classes, newClass]);
    }
    form.reset();
    setEditingClass(null);
    close();
  };

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    form.setValues(cls);
    open();
  };

  const handleDelete = (id: any) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter((cls) => cls.id !== id));
    }
  };

  const rows = classes.map((cls) => (
    <Table.Tr key={cls.id}>
      <Table.Td>{cls.name}</Table.Td>
      <Table.Td>{cls.teacher}</Table.Td>
      <Table.Td>{cls.students}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(cls)}
            title="Edit class"
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(cls.id)}
            title="Delete class"
          >
            <IconTrash style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg" pt="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Manage Classes</Title>
        <Button onClick={() => {
          setEditingClass(null);
          form.reset();
          open();
        }} leftSection={<IconPlus size={16} />}>
          Create Class
        </Button>
      </Group>

      <Paper withBorder shadow="md" p="lg" radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Class Name</Table.Th>
              <Table.Th>Teacher</Table.Th>
              <Table.Th>No. of Students</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text fw={500} ta="center" c="dimmed">No classes found.</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal opened={opened} onClose={close} title={editingClass ? "Update Class" : "Create Class"}>
        <form onSubmit={form.onSubmit(handleAddOrUpdateClass)}>
          <Stack>
            <TextInput label="Class Name" placeholder="e.g., Math 101" {...form.getInputProps('name')} />
            <TextInput label="Teacher" placeholder="e.g., U Aye Maung" {...form.getInputProps('teacher')} />
            <TextInput label="Number of Students" type="number" placeholder="e.g., 20" {...form.getInputProps('students')} />
            <Button type="submit" mt="md">
              {editingClass ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}