import { DataTable } from "@/components/core/tables/DataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import Header from "@/components/layouts/Header";
import { formatDate } from "@/utils/date";
import { useGetReports } from "./queries";
import { DownloadReportButton } from "@/components/core/DownloadButton";
import { ReportTypeFilter } from "@/components/core/selects/ReportTypeFilter";

const columns: MRT_ColumnDef<Reports, unknown>[] = [
  {
    accessorKey: "reportType",
    header: "Report Type",
    size: 150,
    Cell: ({ row }) => {
      return row.original.reportType ?? "-";
    },
  },
  {
    accessorKey: "username",
    header: "UserName",
    size: 120,
    Cell: ({ row }) => {
      return row.original.madeBy.username ?? "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 200,
    Cell: ({ row }) =>
      row.original.createdAt && formatDate(row.original.createdAt),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    size: 200,
    Cell: ({ row }) =>
      row.original.updatedAt && formatDate(row.original.updatedAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    Cell: ({ row }) => {
      return row.original.status.toLocaleLowerCase() ?? "-";
    },
  },
  {
    accessorKey: "_id",
    header: "Actions",
    size: 100,
    Cell: ({ row }) => {
      return (
        <DownloadReportButton id={row.original.id} reportType={row.original.reportType}/>
      );
    },
  },
];

export function ReportListPage() {
  const { data, isFetching, isRefetching } = useGetReports();

  return (
    <>
      <Header title="Generated Reports" />
      <DataTable<Reports>
        rightSection={<ReportTypeFilter />}
        total={data?.totalCount ?? 0}
        isLoading={!isRefetching && isFetching}
        data={data?.data ?? []}
        columns={columns}
        columnPinning={{
          right: ["_id"],
        }}
        searchInputHidden={true}
      />
    </>
  );
}
