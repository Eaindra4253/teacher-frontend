import { useParamsHelper } from "@/hooks/useParamHelper";
import { Select, SelectProps } from "@mantine/core";

type OutletTypeSelectProps = Omit<SelectProps, "data">;

export function OutletTypeSelect(props: OutletTypeSelectProps) {
  const { setParam } = useParamsHelper();

  return (
    <Select
      searchable={false}
      size="xs"
      clearable
      placeholder="Outlet Type"
      onChange={(value) => setParam("outletType", value)}
      data={[
        {
          label: "GNG",
          value: "GNG",
        },
        {
          label: "Capital",
          value: "CAPITAL",
        },
      ]}
      {...props}
    />
  );
}
