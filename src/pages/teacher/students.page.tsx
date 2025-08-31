/* eslint-disable @typescript-eslint/no-explicit-any */
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
  MultiSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

// const API_URL = "https://teacher-6pcl.onrender.com/api/students";
const API_URL = "http://localhost:5000/api/students";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([
    "Myanmar",
    "English",
    "Mathematics",
    "Chemistry",
    "Physics",
    "Biology",
    "Economics",
  ]);
  const [newSubject, setNewSubject] = useState("");

  const form = useForm({
    initialValues: {
      name: "",
      grade: "",
      subject: [] as string[],
      email: "",
      phone: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      grade: (value) => (value.trim().length > 0 ? null : "Grade is required"),
      subject: (value) => (value.length > 0 ? null : "Subject is required"),
      phone: (value) =>
        /^[0-9]{6,15}$/.test(value)
          ? null
          : "Phone must be digits (6–15 numbers)",
    },
  });

  useEffect(() => {
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const handleAddOrUpdateStudent = async (values: any) => {
    try {
      if (editingStudent) {
        const res = await fetch(`${API_URL}/${editingStudent._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Failed to update student");

        const updated = await res.json();
        setStudents(students.map((s) => (s._id === updated._id ? updated : s)));

        notifications.show({
          title: "✅ Success",
          message: "Student updated successfully!",
          color: "green",
        });
      } else {
        const res = await fetch(`${API_URL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Failed to register student");

        const newStudent = await res.json();
        setStudents([...students, newStudent]);

        notifications.show({
          title: "✅ Success",
          message: "Student registered successfully!",
          color: "green",
        });
      }

      form.reset();
      setNewSubject("");
      setEditingStudent(null);
      close();
    } catch (err) {
      console.error("Error saving student:", err);
      notifications.show({
        title: "❌ Error",
        message: "Something went wrong while saving student!",
        color: "red",
      });
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    form.setValues({
      ...student,
      subject: Array.isArray(student.subject)
        ? student.subject
        : [student.subject],
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete student");

        setStudents(students.filter((s) => s._id !== id));

        notifications.show({
          title: "✅ Deleted",
          message: "Student deleted successfully!",
          color: "green",
        });
      } catch (err) {
        console.error("Error deleting student:", err);
        notifications.show({
          title: "❌ Error",
          message: "Failed to delete student!",
          color: "red",
        });
      }
    }
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const rows = filteredStudents.map((student) => (
    <Table.Tr key={student._id}>
      <Table.Td>{student.name || "-"}</Table.Td>
      <Table.Td>{student.grade || "-"}</Table.Td>
      <Table.Td>
        {Array.isArray(student.subject)
          ? student.subject.join(", ")
          : student.subject || "-"}
      </Table.Td>
      <Table.Td>{student.email || "-"}</Table.Td>
      <Table.Td>{student.phone || "-"}</Table.Td>
      <Table.Td>
        {student.created_at
          ? new Date(student.created_at).toLocaleDateString()
          : "-"}
      </Table.Td>
      <Table.Td>
        {student.updated_at
          ? new Date(student.updated_at).toLocaleDateString()
          : "-"}
      </Table.Td>
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

        <Group gap="sm">
          <TextInput
            placeholder="Search students..."
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            size="sm"
            radius="md"
            w={220}
          />

          <Button
            onClick={() => {
              setEditingStudent(null);
              form.reset();
              setNewSubject("");
              open();
            }}
            leftSection={<IconUserPlus size={16} />}
          >
            Register Student
          </Button>
        </Group>
      </Group>

      <Paper withBorder shadow="md" p="lg" radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Grade</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>CreatedAt</Table.Th>
              <Table.Th>UpdatedAt</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text fw={500} ta="center" c="dimmed">
                    No students found.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

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

            {/* MultiSelect for subjects */}
            <MultiSelect
              label="Subjects"
              placeholder="Select subjects"
              data={subjects}
              searchable
              {...form.getInputProps("subject")}
            />

            {/* Add new subject */}
            <TextInput
              placeholder="Add new subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.currentTarget.value)}
              rightSection={
                <Button
                  size="xs"
                  onClick={() => {
                    if (newSubject && !subjects.includes(newSubject)) {
                      setSubjects([...subjects, newSubject]);
                      form.setFieldValue("subject", [
                        ...form.values.subject,
                        newSubject,
                      ]);
                      setNewSubject(""); // clear input
                    }
                  }}
                >
                  Add
                </Button>
              }
            />

            <TextInput
              label="Email"
              placeholder="Enter email"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Phone"
              placeholder="e.g., 09******"
              {...form.getInputProps("phone")}
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
