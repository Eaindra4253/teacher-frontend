import { Can } from "@/components/auth/Can";
import { DataTable } from "@/components/core/tables/DataTable";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { MRT_ColumnDef } from "mantine-react-table";
import { useGetTablets } from "./queries";
import { AddTabletButton, TabletDeleteButton } from "./TabletActions";
import { Flex } from "@mantine/core";

const columns: MRT_ColumnDef<Tablet, unknown>[] = [
  {
    accessorKey: "tabletName",
    header: "Tablet Name",
    size: 150,
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
    accessorKey: "_id",
    header: "Actions",
    size: 100,
    Cell: ({ row }) => {
      return (
        <Flex gap="xs">
          <Can actions={["DELETE_TABLET"]}>
            <TabletDeleteButton id={row.original.id} />
          </Can>
        </Flex>
      );
    },
  },
];

export function TabletListPage() {
  const { data, isFetching, isRefetching } = useGetTablets();

  return (
    <>
      <Header title="Tablets" />
      <DataTable<Tablet>
        rightSection={
          <>
            <Can actions={["CREATE_TABLET"]}>
              <AddTabletButton />
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
