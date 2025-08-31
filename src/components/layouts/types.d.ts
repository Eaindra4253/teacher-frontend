export type DashboardLayoutProps = {
  menus: SidebarMenuType[];
};

export type SidebarMenuItemType = {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarMenuItemType[];
  isRoot?: boolean;
  permission?: string;
};

export type SidebarMenuType = Omit<SidebarMenuItemType, "isRoot">;
