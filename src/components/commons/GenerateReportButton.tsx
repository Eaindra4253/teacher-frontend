import { useGenerateReport } from "@/pages/reports/queries";
import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

export function GenerateReportButton({ reportType, requestType }: { reportType: string; requestType?: string }) {
  const { mutate, isPending } = useGenerateReport(reportType, requestType ?? "");

  return (
    <ActionIcon
      loading={isPending}
      disabled={isPending}
      variant="transparent"
      onClick={() => mutate()}
    >
      <IconDownload />
    </ActionIcon>
  );
}
