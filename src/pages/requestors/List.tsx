import { Can } from "@/components/auth/Can";
import { DataTable } from "@/components/core/tables/DataTable";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { Flex, Text } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import { useGetRequestors } from "./queries";
import { AddRequestModal, AddRequestorButton, EditRequestorButton } from "./RequestorActions";
import { IconCircleFilled } from "@tabler/icons-react";
import { RequestorDisableForm } from "./Form";

const columns: MRT_ColumnDef<Requestor, unknown>[] = [
  {
    accessorKey: "username",
    header: "User Name",
    size: 150,
    Cell: ({ row })=> row.original.username ?? "-",
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 150,
    Cell: ({ row }) => row.original.type ?? "-",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 150,
    Cell: ({ row }) => row.original.phone ?? "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 200,
    Cell: ({ row }) => {
      return (
        (row.original.createdAt && formatDate(row.original.createdAt)) ?? "-"
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    size: 200,
    Cell: ({ row }) => {
      return (
        (row.original.updatedAt && formatDate(row.original.updatedAt)) ?? "-"
      );
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
    size: 150,
    Cell: ({ row }) => {
      return (
        <Flex gap="xs">
          <Can actions={["EDIT_REQUESTOR"]}>
            <EditRequestorButton
              key={row.original.id}
              requestor={row.original}
            />
          </Can>
          <RequestorDisableForm data={row.original} key={`${row.id}-disable`} />
          <Can actions={["CREATE_BCF_REQUEST"]}>
            <AddRequestModal
              key={`${row.original.id}-add-request`}
              requestor={row.original}
            />
          </Can>
        </Flex>
      );
    },
  },
];

export function RequestorListPage() {
  const { data, isFetching, isRefetching } = useGetRequestors();

  return (
    <>
      <Header title="Requestors" />
      <DataTable<Requestor>
        rightSection={
          <>
            <Can actions={["CREATE_REQUESTOR"]}>
              <AddRequestorButton />
            </Can>
          </>
        }
        total={data?.totalCount ?? 0}
        isLoading={!isRefetching && isFetching}
        data={data?.data ?? []}
        columns={columns}
        columnPinning={{
          right: ["_id"],
        }}
      />
    </>
  );
}
