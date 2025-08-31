import { useAuthStore } from "@/stores/auth.store";
import { modals } from "@mantine/modals";

export function useConfirmLogout() {
  const removeAuthUser = useAuthStore((state) => state.removeAuthUser);

  const logout = () => {
    modals.openConfirmModal({
      title: "Are you sure you want to Logout?",
      // children: (
      //   <Text fz="xs" fw="bold">
      //     This action cannot be undone.
      //   </Text>
      // ),
      labels: {
        confirm: "Confirm",
        cancel: "Cancel",
      },
      onConfirm: removeAuthUser,
    });
  };

  return {
    logout,
  };
}
