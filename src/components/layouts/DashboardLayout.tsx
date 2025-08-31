import { SIDEBAR_WIDTH } from "@/configs/constants";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/stores/auth.store";
import { useLayoutStore } from "@/stores/layout.store";
import { AppShell } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export function DashboardLayout() {
  const opened = useLayoutStore((state) => !state.opened);

  const { auth } = useAuthStore();

  // useSocket(auth);

  if (!auth) return <Navigate to="/login" />;

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: opened ? SIDEBAR_WIDTH : 60,
        breakpoint: "sm",
        collapsed: { desktop: false, mobile: !opened },
      }}
      padding="md"
    >
      <Sidebar />
      <Header />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
