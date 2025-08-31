import { useParamsHelper } from "@/hooks/useParamHelper";
import { Select } from "@mantine/core";

export function MerchantTypeFilter() {
  const { setParams, getParam } = useParamsHelper();

  return (
    <Select
      searchable={false}
      value={getParam("merchantType")}
      onChange={(e) => {
        setParams({ merchantType: e, page: 1 });
      }}
      size="xs"
      placeholder="Filter Merchant Type"
      data={[
        {
          label: "Agent Merchant",
          value: "AGENT_MERCHANT",
        },
        {
          label: "Super Agent",
          value: "SUPER_AGENT",
        },
      ]}
    />
  );
}
