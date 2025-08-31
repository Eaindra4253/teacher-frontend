import { ComboboxItem, Loader, Select, SelectProps } from "@mantine/core";
import { useGetAgentSelect } from "./query";

type AgentSelectProps = Omit<SelectProps, "data">;

export function AgentSelect(props: AgentSelectProps) {
  const { data, isLoading } = useGetAgentSelect();

  return (
    <Select
      searchable
      rightSection={isLoading ? <Loader size="xs" /> : undefined}
      label="Agent"
      filter={({ search, options }) => {
        return (options as ComboboxItem[])
          .filter((option) => {
            return option.label.toLowerCase().includes(search.toLowerCase());
          })
          .slice(0, 5);
      }}
      placeholder="Select Agent"
      data={data ?? []}
      {...props}
    />
  );
}
