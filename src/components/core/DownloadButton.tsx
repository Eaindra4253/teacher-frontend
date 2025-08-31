import { useDownloadReport } from "@/pages/reports/queries";
import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

export function DownloadReportButton({
  id,
  reportType,
}: {
  id: number;
  reportType: string;
}) {
  const { mutateAsync } = useDownloadReport();

  const handleDownload = async () => {
    await mutateAsync({ id, reportType});
  };

  return (
    <ActionIcon visibleFrom="sm" variant="transparent" onClick={handleDownload}>
      <IconDownload />
    </ActionIcon>
  );
}
