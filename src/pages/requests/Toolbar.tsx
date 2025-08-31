import { GenerateReportButton } from "@/components/commons/GenerateReportButton";
import { DateInputFilter } from "@/components/core/DateInputFilter";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { Select, Flex } from "@mantine/core";

function StatusFilter() {
  const { getParam, setParam } = useParamsHelper();

  return (
    <Select
      clearable
      searchable={false}
      placeholder="Status Filter"
      size="xs"
      data={["PENDING", "COMPLETED", "CANCELLED", "FAILED"]}
      value={getParam("status")}
      onChange={(value) => setParam("status", value)}
    />
  );
}

export function Toolbar({ requestType }: { requestType: string }) {
  return (
    <>
      <Flex
        w="100%"
        gap="xs"
        direction={{
          base: "column",
          sm: "row",
        }}
      >
        <StatusFilter />
        <DateInputFilter param="fromDate" placeholder="From Date" />
        <DateInputFilter param="toDate" placeholder="To Date" />
        <GenerateReportButton reportType="CASH_REQUEST_REPORT" requestType={requestType} />
      </Flex>
    </>
  );
}
