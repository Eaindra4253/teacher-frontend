import { useLayoutStore } from "@/stores/layout.store";
import { AppShell, Burger, Flex, Group } from "@mantine/core";
import { ReactNode } from "react";
import { ThemeButton } from "./ThemeButton";
import { UserDropdownMenu } from "./UserDropdownMenu";

export default function Header(props: { title?: ReactNode }) {
  const { toggleSidebar } = useLayoutStore((state) => state);

  return (
    <AppShell.Header>
      <Group h="100%" justify="space-between" align="center">
        <Flex gap="sm" align="center" px="md">
          <Burger onClick={toggleSidebar} hiddenFrom="sm" size="sm" />
          {props.title}
        </Flex>
        <Group px="md">
          <ThemeButton />
          <UserDropdownMenu />
        </Group>
      </Group>
    </AppShell.Header>
  );
}
