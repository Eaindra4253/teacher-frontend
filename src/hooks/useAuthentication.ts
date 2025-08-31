import { roles } from "@/configs/permissions";
import { useAuthStore } from "@/stores/auth.store";

export function useCheckActions(actions: string[]): boolean {
  const role = useAuthStore((state) => state.auth?.user?.role);

  if (!role) return false;

  return roles[role].actions.some((action) => actions.includes(action));
}
