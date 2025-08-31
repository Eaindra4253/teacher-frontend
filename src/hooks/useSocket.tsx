import { NotificationMessage } from "@/components/commons/NotificationMessage";
import { socket } from "@/configs/socket";
import { notifications } from "@mantine/notifications";
import { IconReport } from "@tabler/icons-react";
import { useEffect } from "react";

function showNotification(data: { reportType: string; jobId: number }) {
  notifications.show({
    icon: <IconReport size={16} />,
    id: `${data.jobId}`,
    title: "Report Generation Completed",
    autoClose: false,
    message: (
      <NotificationMessage reportType={data.reportType} jobId={data.jobId} />
    ),
    color: "green",
  });
}

export function useSocket(auth?: LoginResponse) {
  useEffect(() => {
    if (auth) {
      socket.connect();

      socket.emit("authenticate", auth.user?.id);

      socket.on("reportCompleted", showNotification);
    }

    return () => {
      socket.disconnect();
    };
  }, [auth]);
}
