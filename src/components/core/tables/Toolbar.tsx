import { SearchInput } from "@/components/commons/SearchInput";
import { Flex, Paper } from "@mantine/core";
import { ReactNode } from "react";

export type ToolbarProps = {
  rightSectioin?: ReactNode;
  searchInputHidden?: boolean;
};

export function Toolbar({ rightSectioin, searchInputHidden = false }: ToolbarProps) {
  return (
    <Paper px="md" py="sm">
      <Flex
        gap="xs"
        direction={{
          base: "column",
          sm: "row",
        }}
        justify={{
          base: "unset",
          sm: "space-between",
        }}
      >
        {!searchInputHidden ? <SearchInput /> : <div/>}
        <Flex
          gap="xs"
          w={{
            base: "100%",
            sm: "auto",
          }}
          justify={{
            base: "unset",
            sm: "end",
          }}
        >
          {rightSectioin}
        </Flex>
      </Flex>
    </Paper>
  );
}
