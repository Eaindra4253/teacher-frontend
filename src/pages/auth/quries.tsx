import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react'; // Or whichever icon library you're using
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth.store';
import { loginSchema } from '@/configs/schema';
import { login } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

export function useLoginQueries() {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const navigate = useNavigate(); // Get the navigate function

  return useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => login(data),
    onSuccess: (response) => {
      if (response) {
        setAuthUser(response);
        notifications.show({
          color: 'green',
          title: 'Success',
          icon: <IconCheck />,
          message: 'Login Successful',
          autoClose: 2000,
        });

        // Redirect to the dashboard page after a brief delay
        setTimeout(() => {
          navigate('/'); // Change to your dashboard route
        }, 500); // 500ms delay to allow the toast to show
      }
    },
    onError: (error) => {
      notifications.show({
        color: 'red',
        title: 'Login Failed',
        message: error.message,
        autoClose: 2000,
      });
    },
  });
}