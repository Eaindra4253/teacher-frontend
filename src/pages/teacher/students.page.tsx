import { useState, useEffect } from "react";
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

const API_URL = "https://teacher-6pcl.onrender.com/api/students"; // ⚡ change to your backend domain if hosted

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);

  const form = useForm({
    initialValues: {
      name: "",
      grade: "",
      subject: "",
      email: "",
      major: "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  // ✅ Fetch students when component loads
  useEffect(() => {
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // ✅ Add or update student
  const handleAddOrUpdateStudent = async (values: any) => {
    try {
      if (editingStudent) {
        // Update existing student
        const res = await fetch(`${API_URL}/${editingStudent._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const updated = await res.json();
        setStudents(
          students.map((s) => (s._id === updated._id ? updated : s))
        );
      } else {
        // Add new student
        const res = await fetch(`${API_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const newStudent = await res.json();
        setStudents([...students, newStudent]);
      }
      form.reset();
      setEditingStudent(null);
      close();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };

  // ✅ Edit student
  const handleEdit = (student: any) => {
    setEditingStudent(student);
    form.setValues(student);
    open();
  };

  // ✅ Delete student
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setStudents(students.filter((s) => s._id !== id));
    }
  };

  const rows = students.map((student) => (
    <Table.Tr key={student._id}>
      <Table.Td>{student.name}</Table.Td>
      <Table.Td>{student.grade}</Table.Td>
      <Table.Td>{student.subject}</Table.Td>
      <Table.Td>{student.email}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(student)}
            title="Edit student"
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(student._id)}
            title="Delete student"
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
        <Title order={2}>Manage Students</Title>
        <Button
          onClick={() => {
            setEditingStudent(null);
            form.reset();
            open();
          }}
          leftSection={<IconUserPlus size={16} />}
        >
          Register Student
        </Button>
      </Group>

      <Paper withBorder shadow="md" p="lg" radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Year/Grade</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Email/Phone</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text fw={500} ta="center" c="dimmed">
                    No students found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal for adding/editing students */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingStudent ? "Update Student" : "Register Student"}
      >
        <form onSubmit={form.onSubmit(handleAddOrUpdateStudent)}>
          <Stack>
            <TextInput
              label="Full Name"
              placeholder="Enter full name"
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Grade"
              placeholder="e.g., Grade 10"
              {...form.getInputProps("grade")}
            />
            <TextInput
              label="Subject"
              placeholder="e.g., English"
              {...form.getInputProps("subject")}
            />
            <TextInput
              label="Email"
              placeholder="Enter email"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Major"
              placeholder="e.g., Computer Science"
              {...form.getInputProps("major")}
            />
            <Button type="submit" mt="md">
              {editingStudent ? "Update" : "Register"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
