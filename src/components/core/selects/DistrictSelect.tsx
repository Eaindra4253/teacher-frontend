import { ComboboxData, Loader, Select, SelectProps } from "@mantine/core";
import { useEffect } from "react";
import { useGetAllLocations } from "./query";

export function DistrictSelect({
  setTownships,
  ...props
}: SelectProps & { setTownships: (data: ComboboxData) => void }) {
  const { data, isLoading } = useGetAllLocations();

  useEffect(() => {
    if (!props.value) setTownships([]);
    else if (data) {
      const district = data.find((district) => district.value === props.value);
      setTownships(district?.townships ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, props.value]);

  return (
    <Select
      {...props}
      disabled={isLoading}
      leftSection={isLoading ? <Loader size="xs" /> : null}
      data={data?.map(({ label, value }) => ({
        value,
        label,
      }))}
    />
  );
}
