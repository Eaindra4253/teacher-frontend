import { useGetAllTablets} from "@/pages/tablets/queries";
import { Loader, Select, SelectProps } from "@mantine/core";

type TabletSelectProps = Omit<SelectProps, "data">;

export function TabletSelect(props: TabletSelectProps) {
  const { data, isLoading } = useGetAllTablets();

  return (
    <Select
      searchable
      rightSection={isLoading ? <Loader size="xs" /> : undefined}
      label="Tablet Id"
      placeholder="Please select tablet Id"
      data={data ?? []}
      {...props}
    />
  );
}
