import { loginSchema } from "@/configs/schema";
import { useAuthStore } from "@/stores/auth.store";
import {
  Button,
  Center,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { useLoginQueries } from "./quries";
import Logo from "@/assets/icons/logo.jpg";

export function LoginPage() {
  const auth = useAuthStore((state) => state.auth);

  const { mutate, isPending } = useLoginQueries();

  const form = useForm<z.infer<typeof loginSchema>>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = (values: z.infer<typeof loginSchema>) => mutate(values);

  if (auth) return <Navigate to="/" />;

  return (
  <Center
      h="100vh"
      w="100vw"
      style={{
        background: 'linear-gradient(135deg, #A4C5F0 0%, #D8BFD8 100%)',
      }}
    >
      <Paper
        miw="25rem"
        maw="25rem"
        shadow="xl"
        radius="lg"
        p="xl"
        withBorder
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Center>
              <Image
                src={Logo}
                alt="UTH Logo"
                h={100} 
                w={100}
                radius="md"
              />
            </Center>
            <Title ta="center" order={2} fw={700} c="#3944BC">
              Welcome Back
            </Title>
            <Text ta="center" c="dimmed" size="sm" mb="md">
              Please log in to your account.
            </Text>
            <TextInput
              label="Email"
              placeholder="Your email"
              radius="md"
              size="md"
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              radius="md"
              size="md"
              {...form.getInputProps("password")}
            />
            <Button
              disabled={isPending}
              loading={isPending}
              type="submit"
              mt="md"
              size="md"
              fullWidth
              variant="gradient"
              gradient={{ from: '#5c78f1', to: '#6293c6' }}
            >
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
