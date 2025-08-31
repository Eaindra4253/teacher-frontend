import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { IconCalendar } from "@tabler/icons-react";

const theme = createTheme({
  fontFamily: "Trebuchet MS",
  primaryColor: "primary",
  colors: {
    primary: [
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
      "#3944BC",
    ],
  },
  components: {
    DateInput: {
      defaultProps: {
        size: "xs",
        leftSection: <IconCalendar size={16} />,
        valueFormat: "YYYY-MMM-DD",
      },
    },
    Select: {
      defaultProps: {
        checkIconPosition: "right",
        searchable: false,
        clearable: true,
      },
    },
    NavLink: {
      styles: {
        root: {
          borderRadius: 4,
        },
      },
      defaultProps: {
        variant: "filled",
      },
    },
  },
});

export type MantineProviderWrapperProps = {
  children: React.ReactNode;
};

export default function MantineProviderWrapper(
  props: MantineProviderWrapperProps
) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" />
      <ModalsProvider>
        {props.children}
      </ModalsProvider>
    </MantineProvider>
  );
}
