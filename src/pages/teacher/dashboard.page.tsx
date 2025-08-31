import { Container, Title, Text } from '@mantine/core';

export default function TeacherDashboardPage() {
  return (
    <Container size="md" pt="lg">
      <Title order={2}>Teacher Dashboard</Title>
      <Text c="dimmed" mt="md">
        Welcome to the teacher's dashboard. This is the central hub for all your teaching activities.
      </Text>
    </Container>
  );
}