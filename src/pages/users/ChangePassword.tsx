import Header from "@/components/layouts/Header";
import { userChangePasswordSchema } from "@/configs/schema";
import { useAuthStore } from "@/stores/auth.store";
import {
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link } from "react-router-dom";
import { useUpdateUser } from "./queries";

export function ChangePasswordPage() {
  const user = useAuthStore((state) => state.auth?.user);

  if (!user) throw new Error("User not found");

  const { isPending, mutateAsync } = useUpdateUser(user!.id);

  const form = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(userChangePasswordSchema),
  });

  return (
    <>
      <Header title="Change Password" />
      <Center h="60vh">
        <Stack
          miw={{
            base: "100%",
            sm: "40%",
          }}
        >
          <Title order={4}>Change Password for {user?.username}</Title>
          <Paper withBorder p="md">
            <form
              onSubmit={form.onSubmit((values) =>
                mutateAsync({ password: values.password }).then(() =>
                  form.reset()
                )
              )}
            >
              <Stack>
                <PasswordInput
                  label="New Password"
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  label="Confirm Password"
                  {...form.getInputProps("confirmPassword")}
                />
                <Group justify="end">
                  <Button variant="outline" component={Link} to="/" size="sm">
                    Cancel
                  </Button>
                  <Button
                    disabled={isPending}
                    loading={isPending}
                    size="sm"
                    type="submit"
                  >
                    Change Password
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Center>
    </>
  );
}
