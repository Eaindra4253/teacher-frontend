import { GenerateReportButton } from "@/components/commons/GenerateReportButton";
import { MerchantTypeFilter } from "@/components/core/selects/MerchantTypeFilter";
import { DataTable } from "@/components/core/tables/DataTable";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { MRT_ColumnDef } from "mantine-react-table";
import { AddMerchantButton, EditMerchantButton } from "./Form";
import { useGetMerchants } from "./queries";

const columns: MRT_ColumnDef<Merchant, unknown>[] = [
  {
    accessorKey: "merchantName",
    header: "Merchant Name",
    size: 150,
  },
  {
    accessorKey: "merchantType",
    header: "Merchant Type",
    size: 150,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 150,
  },
  {
    accessorKey: "address",
    header: "Address",
    size: 200,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 200,
    Cell: ({ row }) =>
      (row.original.createdAt && formatDate(row.original.createdAt)) || "-",
  },
  {
    accessorKey: "_id",
    header: "",
    size: 40,
    Cell: ({ row }) => <EditMerchantButton agent={row.original} />,
  },
];

export function MerchantListPage() {
  const { data, isFetching, isRefetching } = useGetMerchants();

  return (
    <>
      <Header title="Merchants" />
      <DataTable<Merchant>
        rightSection={
          <>
            <MerchantTypeFilter />
            <AddMerchantButton />
            <GenerateReportButton reportType="MERCHANT_REPORT" />
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
