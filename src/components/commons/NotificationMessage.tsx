import { useDownloadReport } from "@/pages/reports/queries";
import { Button, Flex, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDownload } from "@tabler/icons-react";

export function NotificationMessage({
  reportType,
  jobId,
}: {
  reportType: string;
  jobId: number;
}) {
  const { mutateAsync } = useDownloadReport();

  const downloadReport = (jobId: number, reportType: string) => {
    notifications.update({
      icon: <IconDownload size={16} />,
      loading: true,
      id: `${jobId}`,
      title: "Download report",
      autoClose: false,
      withCloseButton: false,
      message: "Downloading report...",
      color: "green",
    });
    mutateAsync({ id: jobId, reportType }).then(() => {
      notifications.update({
        icon: <IconCheck size={16} />,
        id: `${jobId}`,
        loading: false,
        title: "Report Download",
        autoClose: 5000,
        message: "Report downloaded successfully",
        color: "green",
      });
    });
  };

  return (
    <Stack fz="xs" gap={0}>
      <Text fz="sm">
        <b>{reportType}</b> generated successfully.
      </Text>
      <Flex wrap="wrap" align="center" gap={2}>
        <div>You can also check in generated reports page or </div>
        <Button
          h="max-content"
          p="0"
          size="xs"
          variant="white"
          onClick={() => downloadReport(jobId, reportType)}
        >
          Download here
        </Button>
      </Flex>
    </Stack>
  );
}
