import { Can } from "@/components/auth/Can";
import { OutletTypeSelect } from "@/components/core/selects/OutletTypeSelect";
import { DataTable } from "@/components/core/tables/DataTable";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { Flex } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table";
import {
  AddRequestModal,
  AddStoreButton,
  EditStoreButton,
} from "./StoreActions";
import { GenerateReportButton } from "@/components/commons/GenerateReportButton";
import { useGetStores } from "./queries";

const columns: MRT_ColumnDef<Store, unknown>[] = [
  {
    accessorKey: "outletName",
    header: "Outlet Name",
    size: 150,
  },
  {
    accessorKey: "outletType",
    header: "Outlet Type",
    size: 150,
  },
  {
    accessorKey: "ddmName",
    header: "DDM Name",
    size: 150,
  },
  {
    accessorKey: "ddmPhone",
    header: "DDM Phone",
    size: 150,
  },
  {
    accessorKey: "address",
    header: "Address",
    size: 300,
  },
  {
    accessorKey: "merchant",
    header: "Merchant",
    size: 150,
    Cell: ({ row }) => {
      return row.original.merchant?.merchantName ?? "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 200,
    Cell: ({ row }) => {
      return (
        (row.original.createdAt && formatDate(row.original.createdAt)) || "-"
      );
    },
  },
  {
    accessorKey: "_id",
    header: "",
    size: 100,
    Cell: ({ row }) => {
      return (
        <Flex gap="xs" justify="center" align="center">
          <Can actions={["EDIT_STORE"]}>
            <EditStoreButton key={row.original.id} store={row.original} />
          </Can>
          <Can actions={["CREATE_REQUEST"]}>
            <AddRequestModal
              key={`${row.original.id}-add-request`}
              store={row.original}
            />
          </Can>
        </Flex>
      );
    },
  },
];

export function StoreListPage() {
  const { data, isFetching, isRefetching } = useGetStores();

  return (
    <>
      <Header title="Stores" />
      <DataTable<Store>
        rightSection={
          <>
            <OutletTypeSelect />
            <Can actions={["CREATE_STORE"]}>
              <AddStoreButton />
            </Can>
            <GenerateReportButton reportType="STORE_REPORT"/>
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
