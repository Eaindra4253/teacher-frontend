import Logo from "@/assets/icons/logo.jpg";
import { useLayoutStore } from "@/stores/layout.store";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Center,
  Divider,
  Flex,
  HoverCard,
  Image,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { menuItems } from "./menu";
import { SidebarMenuItemType } from "./types";
import { roles } from "@/configs/permissions";
import { useAuthStore } from "@/stores/auth.store";

export default function Sidebar() {
  const user = useAuthStore((state) => state.auth?.user);
  const currentUserRole = user?.role;
  const userPermissions = currentUserRole
    ? roles[currentUserRole]?.actions || []
    : [];

  const { opened, toggleSidebar } = useLayoutStore((state) => state);

  return (
    <AppShell.Navbar>
      <Flex
        justify={!opened ? "space-between" : "center"}
        align="center"
        h={60}
        p="xs"
      >
        {!opened && (
          <Flex gap="8px" align="center">
            <Avatar bg="primary.0">
              <Image src={Logo} width={20} height={20} />
            </Avatar>
            <Text>UTH</Text>
          </Flex>
        )}
        <Burger size="sm" opened={!opened} onClick={toggleSidebar} />
      </Flex>
      <Stack gap="4px" p="xs" h="100%">
        {menuItems.map((e) => (
          <SideBarMenuItem
            isRoot
            key={e.path}
            {...e}
            userPermissions={userPermissions}
          />
        ))}
      </Stack>
    </AppShell.Navbar>
  );
}

const SideBarMenuItem = ({
  label,
  icon,
  path,
  children,
  permission,
  isRoot = false,
  userPermissions,
}: SidebarMenuItemType & { userPermissions: string[] }) => {
  const location = useLocation();
  const { opened, toggleSidebar } = useLayoutStore((state) => state);

  if (permission && !userPermissions.includes(permission)) return null;

  const active =
    location.pathname === path ||
    (children && children.some((item) => item.path === location.pathname));

  if (opened) {
    return (
      <HoverCard
        shadow="md"
        position="right-start"
        withArrow
        offset={16}
        arrowOffset={20}
      >
        <HoverCard.Target>
          {isRoot ? (
            <Center py={4}>
              <ActionIcon
                color={active ? "primary" : "gray"}
                variant="transparent"
                title={label}
                component={Link}
                to={path ?? "#"}
              >
                {icon}
              </ActionIcon>
            </Center>
          ) : (
            <NavLink
              active={children ? false : active}
              miw={180}
              label={label}
              title={label}
              component={Link}
              to={path!}
              rightSection={children ? ">" : undefined}
            />
          )}
        </HoverCard.Target>
        <HoverCard.Dropdown p="4">
          <Stack gap={4}>
            {children?.map((item) => (
              <SideBarMenuItem
                key={item.label}
                {...item}
                userPermissions={userPermissions}
              />
            ))}
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  }

  if (children) {
    return (
      <NavLink
        childrenOffset={16}
        label={label}
        leftSection={icon}
        to={path!}
        component={Link}
        defaultOpened={children.some((item) => item.path === location.pathname)}
      >
        <Stack gap={2}>
          {children.map((item) => (
            <SideBarMenuItem
              key={item.label}
              {...item}
              userPermissions={userPermissions}
            />
          ))}
          <Divider />
        </Stack>
      </NavLink>
    );
  }

  return (
    <>
      <NavLink
        visibleFrom="md"
        active={active}
        label={label}
        title={label}
        leftSection={icon ?? <Box w={16} />}
        to={path!}
        component={Link}
      />
      <NavLink
        hiddenFrom="md"
        onClick={toggleSidebar}
        active={active}
        label={label}
        title={label}
        leftSection={icon ?? <Box w={16} />}
        to={path!}
        component={Link}
      />
    </>
  );
};
