import { useMantineColorScheme, ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon color="gray" variant="outline" onClick={toggleColorScheme}>
      {colorScheme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
    </ActionIcon>
  );
}
