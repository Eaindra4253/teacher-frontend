import { useParamsHelper } from "@/hooks/useParamHelper";
import { Select, SelectProps } from "@mantine/core";

type RequestorTypeSelectProps = Omit<SelectProps, "data">;

export function ReqeustorTypeSelect(props: RequestorTypeSelectProps) {
  const { setParam } = useParamsHelper();

  return (
    <Select
      searchable={false}
      label="Requestor Type"
      size="sm"
      clearable
      placeholder="Requestor Type"
      onChange={(value) => setParam("requestorType", value)}
      data={[
        {
          label: "BCF",
          value: "BCF",
        }
      ]}
      {...props}
    />
  );
}
