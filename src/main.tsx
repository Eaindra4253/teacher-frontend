import "@/assets/segoe-ui/style.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-react-table/styles.css";

import { router } from "@/configs/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import MantineProviderWrapper from "./components/core/MantineProvider";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProviderWrapper>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </MantineProviderWrapper>
  </QueryClientProvider>
);
