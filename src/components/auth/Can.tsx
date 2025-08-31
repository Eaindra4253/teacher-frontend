import { useCheckActions } from "@/hooks/useAuthentication";

export function Can({
  children,
  actions,
  condition = true,
  notAllowComponent,
}: {
  children: React.ReactNode;
  actions: string[];
  condition?: boolean;
  notAllowComponent?: React.ReactNode;
}) {
  const isAllowed = useCheckActions(actions);

  if (isAllowed && condition) return <>{children}</>;

  if (notAllowComponent) return notAllowComponent;

  return null;
}
