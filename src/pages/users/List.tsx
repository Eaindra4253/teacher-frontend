import { DataTable } from "@/components/core/tables/DataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useGetUsers } from "./queries";
import {
  UserCreateForm,
  UserDisableForm,
  UserPasswordChangeForm,
  UserUpdateForm,
} from "./Form";
import { Flex, Text } from "@mantine/core";
import { Can } from "@/components/auth/Can";
import Header from "@/components/layouts/Header";
import { IconCircleFilled } from "@tabler/icons-react";

const columns: MRT_ColumnDef<User, unknown>[] = [
  {
    accessorKey: "username",
    header: "User Name",
    size: 200,
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 150,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 150,
  },
  {
    accessorKey: "department",
    header: "Department",
    size: 150,
    Cell: ({ row }) => {
      return row.original.department ?? "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 180,
    Cell: ({ row }) => {
      const c = row.original.status === "ACTIVE" ? "#00cc88" : "#ff3366";

      return (
        <Flex align="center" justify="flex-start" gap="xs">
          <IconCircleFilled size={10} color={c} />
          <Text fw="bold" fz="xs" c="gray" tt="capitalize">
            {row.original.status?.toLocaleLowerCase()}
          </Text>
        </Flex>
      );
    },
  },
  {
    accessorKey: "_id",
    header: "Actions",
    size: 50,
    Cell: ({ row }) => {
      return (
        <Flex gap="xs">
          <UserUpdateForm data={row.original} key={row.id} />
          <UserPasswordChangeForm
            data={row.original}
            key={`${row.id}-change-password`}
          />
          <UserDisableForm data={row.original} key={`${row.id}-disable`} />
        </Flex>
      );
    },
  },
];

export function UserListPage() {
  const { data, isLoading } = useGetUsers();

  return (
    <Can actions={["VIEW_USER"]}>
      <Header title="Users" />
      <DataTable<User>
        rightSection={<UserCreateForm />}
        total={data?.totalCount ?? 0}
        isLoading={isLoading}
        data={data?.data ?? []}
        columns={columns}
        columnPinning={{
          right: ["_id"],
        }}
      />
    </Can>
  );
}
