import { useParamsHelper } from "@/hooks/useParamHelper";
import { Select, SelectProps } from "@mantine/core";

type ReportTypeSelectProps = Omit<SelectProps, "data">;

export function ReportTypeFilter(props: ReportTypeSelectProps) {
  const { setParam } = useParamsHelper();

  return (
    <Select
      searchable={false}
      size="xs"
      clearable
      placeholder="Report Type"
      onChange={(value) => setParam("reportType", value)}
      data={[
        {
          label: "CASH REQUEST REPORT",
          value: "CASH_REQUEST_REPORT",
        },
        {
          label: "MERCHANT REPORT",
          value: "MERCHANT_REPORT",
        },
        {
          label: "STORE REPORT",
          value: "STORE_REPORT",
        }
      ]}
      {...props}
    />
  );
}