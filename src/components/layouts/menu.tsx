import {
  IconCalendar,
  IconChalkboard,
  IconSchool,
  IconUserCircle,
} from "@tabler/icons-react";

export type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  path: string;
  children?: MenuItem[];
  permission: string;
};

export const menuItems: MenuItem[] = [
  {
    label: "Teacher Features",
    path: "/teacher",
    icon: <IconChalkboard size={16} />,
    permission: "VIEW_CAPITAL_GNG",
    children: [
      {
        label: "Students",
        path: "/teacher/students",
        icon: <IconSchool size={16} />,
        permission: "VIEW_CAPITAL_GNG",
      },
      {
        label: "Classes",
        path: "/teacher/classes",
        icon: <IconUserCircle size={16} />,
        permission: "VIEW_CAPITAL_GNG",
      },
      {
        label: "Schedules",
        path: "/teacher/schedules",
        icon: <IconCalendar size={16} />,
        permission: "VIEW_CAPITAL_GNG",
      },
    ],
  },
];
