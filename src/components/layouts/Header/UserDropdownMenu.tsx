import { useConfirmLogout } from "@/hooks/useConfirmLogout";
import { useAuthStore } from "@/stores/auth.store";
import {
  Menu,
  Avatar,
  MenuDivider,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconLock, IconPower } from "@tabler/icons-react";
import { Link } from "react-router-dom";

function LogoutMenu() {
  const theme = useMantineTheme();

  const { logout } = useConfirmLogout();

  return (
    <Menu.Item
      leftSection={<IconPower size={20} color={theme.colors.red[6]} />}
      onClick={logout}
      c="red.6"
    >
      Logout
    </Menu.Item>
  );
}

function UserAvatar() {
  const user = useAuthStore((state) => state.auth?.user);
  return (
    <Avatar size={30} variant="filled">
      {user?.username?.charAt(0)}
    </Avatar>
  );
}

export function UserDropdownMenu() {
  const theme = useMantineTheme();

  const user = useAuthStore((state) => state.auth?.user);

  return (
    <Menu shadow="lg" width={250}>
      <Menu.Target>
        <span>
          <UserAvatar />
        </span>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<UserAvatar />}>
          <Text fw="bold" fz="sm">
            {user?.username}
          </Text>
          <Text fz="sm">{user?.email}</Text>
        </Menu.Item>
        <MenuDivider />
        <Menu.Item
          c="orange"
          leftSection={<IconLock size={20} color={theme.colors.orange[6]} />}
          component={Link}
          to={"/change-password"}
        >
          Change Password
        </Menu.Item>
        <LogoutMenu />
      </Menu.Dropdown>
    </Menu>
  );
}
