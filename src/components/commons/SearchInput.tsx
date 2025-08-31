import { useParamsHelper } from "@/hooks/useParamHelper";
import { TextInput, TextInputProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function SearchInput(props: TextInputProps) {
  const [search, setSearch] = useState("");

  const [value] = useDebouncedValue(search, 500);

  const { setParams } = useParamsHelper();

  useEffect(() => {
    setParams({ search: value, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TextInput
      miw={{
        base: 200,
      }}
      {...props}
      size="xs"
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
      placeholder="Search..."
      leftSection={<IconSearch size={16} />}
    />
  );
}
