/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Papa from "papaparse";
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

const API_URL = "https://teacher-6pcl.onrender.com/api/students";
const GOOGLE_SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpMd3HvIOnR1b0aZqei662aCZC7uvUmL6ALAtCke8NC8b2MNQr5qTjZfh4rPoW9vErTDZSBPsqZRWf/pub?output=csv";

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
      address: "",
      school: "",
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      grade: (value) => (value.trim().length > 0 ? null : "Grade is required"),
      subject: (value) => (value.length > 0 ? null : "Subject is required"),
      phone: (value) =>
        /^[0-9]{6,15}$/.test(value)
          ? null
          : "Phone must be digits (6–15 numbers)",
      address: (value) =>
        value.trim().length > 0 ? null : "Address is required",
      school: (value) =>
        value.trim().length > 0 ? null : "School is required",
    },
  });

  // === Helpers ===
  const normalizeKey = (k: string) => k.trim().toLowerCase();
  const findKeyFor = (row: any, names: string[]) =>
    Object.keys(row).find((k) => {
      const nk = normalizeKey(k);
      return names.some((n) => nk === n || nk.includes(n));
    }) || null;

  const mapRowToStudent = (row: any, idx: number) => {
    const nameKey = findKeyFor(row, ["name", "full name"]);
    const gradeKey = findKeyFor(row, ["grade"]);
    const subjectKey = findKeyFor(row, ["subject", "subjects"]);
    const emailKey = findKeyFor(row, ["email", "e-mail"]);
    const phoneKey = findKeyFor(row, ["phone", "phone number"]);
    const addressKey = findKeyFor(row, ["address", "home address"]);
    const schoolKey = findKeyFor(row, ["school"]);
    const tsKey = findKeyFor(row, ["timestamp", "time", "submitted"]);

    const rawSubjects = subjectKey ? row[subjectKey] || "" : "";
    const subjectArray =
      typeof rawSubjects === "string"
        ? rawSubjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : Array.isArray(rawSubjects)
        ? rawSubjects
        : [];

    return {
      _id: `sheet-${idx}`,
      name: nameKey ? row[nameKey] : "",
      grade: gradeKey ? row[gradeKey] : "",
      subject: subjectArray,
      email: emailKey ? row[emailKey] : "",
      phone: phoneKey ? row[phoneKey] : "",
      address: addressKey ? row[addressKey] : "",
      school: schoolKey ? row[schoolKey] : "",
      created_at: tsKey ? row[tsKey] : "",
      source: "sheet",
    };
  };

  const mergeStudents = (apiStudents: any[], sheetStudents: any[]) => {
    const map = new Map<string, any>();
    const keyFor = (s: any) => {
      if (s._id && !String(s._id).startsWith("sheet-")) return `db:${s._id}`;
      const email = (s.email || "").trim().toLowerCase();
      const ts = (s.created_at || "").trim();
      return `sheet:${email}:${ts}`;
    };
    (apiStudents || []).forEach((s) =>
      map.set(keyFor(s), { ...s, source: "api" })
    );
    (sheetStudents || []).forEach((s) => {
      const k = keyFor(s);
      if (!map.has(k)) map.set(k, s);
    });
    return Array.from(map.values());
  };

  // === Fetchers ===
  async function fetchSheet() {
    try {
      const url = `${GOOGLE_SHEET_CSV}&t=${Date.now()}`;
      const text = await fetch(url, { cache: "no-store" }).then((r) =>
        r.text()
      );
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      return (parsed.data as any[]).map((r, i) => mapRowToStudent(r, i));
    } catch (err) {
      console.error("Sheet fetch error:", err);
      return [];
    }
  }

  async function fetchApiStudents() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("API fetch failed");
      const data = await res.json();
      return (data || []).map((d: any) => ({ ...d, source: "api" }));
    } catch (err) {
      console.error("API fetch error:", err);
      return [];
    }
  }

  // === Polling loader ===
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      const [apiData, sheetData] = await Promise.all([
        fetchApiStudents(),
        fetchSheet(),
      ]);
      if (!mounted) return;
      setStudents(mergeStudents(apiData, sheetData));
    }
    loadAll();

    const POLL_MS = 15000;
    const id = setInterval(loadAll, POLL_MS);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // === CRUD Handlers ===
  const handleAddOrUpdateStudent = async (values: any) => {
    try {
      if (
        editingStudent &&
        editingStudent._id &&
        editingStudent.source === "api"
      ) {
        // 🟢 Update existing
        const res = await fetch(`${API_URL}/${editingStudent._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setStudents((s) =>
          s.map((x) =>
            x._id === updated._id ? { ...updated, source: "api" } : x
          )
        );
        notifications.show({
          title: "✅ Success",
          message: "Student updated!",
          color: "green",
        });
      } else {
        // 🟢 Insert new
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Create failed");
        const newStudent = await res.json();

        // ⬇️ Replace sheet-data with real API-data
        setStudents((s) => {
          if (editingStudent?.source === "sheet") {
            return s.map((x) =>
              x._id === editingStudent._id
                ? { ...newStudent, source: "api" }
                : x
            );
          }
          return [...s, { ...newStudent, source: "api" }];
        });

        notifications.show({
          title: "✅ Success",
          message: "Student registered!",
          color: "green",
        });
      }

      form.reset();
      setNewSubject("");
      setEditingStudent(null);
      close();
    } catch (err) {
      notifications.show({
        title: "❌ Error",
        message: "Save failed",
        color: "red",
      });
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    form.setValues({
      name: student.name || "",
      grade: student.grade || "",
      subject: Array.isArray(student.subject)
        ? student.subject
        : student.subject
        ? [student.subject]
        : [],
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
      school: student.school || "",
    });
    open();
  };

// In your handleDelete function
const handleDelete = async (id: string) => {
  // ...

  // This is the correct logic for deleting from the database
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    setStudents((s) => s.filter((x) => x._id !== id));
    notifications.show({
      title: "✅ Deleted",
      message: "Student removed",
      color: "green",
    });
  } catch {
    notifications.show({
      title: "❌ Error",
      message: "Delete failed",
      color: "red",
    });
  }
};

  // === Render ===
  const filteredStudents = students.filter((student) =>
    Object.values(student).some((v) =>
      String(v).toLowerCase().includes(searchQuery.toLowerCase())
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
      <Table.Td>{student.address || "-"}</Table.Td>
      <Table.Td>{student.school || "-"}</Table.Td>
      <Table.Td>
        {student.created_at
          ? new Date(student.created_at).toLocaleString()
          : "-"}
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => handleEdit(student)}
          >
            <IconEdit style={{ width: rem(16), height: rem(16) }} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => handleDelete(student._id)}
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
        <Group>
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
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
              <Table.Th>Address</Table.Th>
              <Table.Th>School</Table.Th>
              <Table.Th>CreatedAt</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <Text ta="center" c="dimmed">
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
            <TextInput label="Full Name" {...form.getInputProps("name")} />
            <TextInput label="Grade" {...form.getInputProps("grade")} />
            <MultiSelect
              label="Subjects"
              data={subjects}
              searchable
              {...form.getInputProps("subject")}
            />
            <TextInput
              placeholder="Add new subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.currentTarget.value)}
              rightSection={
                <Button
                  size="xs"
                  onClick={() => {
                    if (newSubject && !subjects.includes(newSubject)) {
                      setSubjects((s) => [...s, newSubject]);
                      form.setFieldValue("subject", [
                        ...form.values.subject,
                        newSubject,
                      ]);
                      setNewSubject("");
                    }
                  }}
                >
                  Add
                </Button>
              }
            />
            <TextInput label="Email" {...form.getInputProps("email")} />
            <TextInput label="Phone" {...form.getInputProps("phone")} />
            <TextInput label="Address" {...form.getInputProps("address")} />
            <TextInput label="School" {...form.getInputProps("school")} />
            <Button type="submit" mt="md">
              {editingStudent
                ? editingStudent.source === "api"
                  ? "Update"
                  : "Import & Create"
                : "Register"}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
