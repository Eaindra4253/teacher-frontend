import { DataTable } from "@/components/core/tables/DataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useGetHistory } from "./queries";
import { CopyText } from "@/components/commons/CopyText";
import { Flex, Text } from "@mantine/core";
import Header from "@/components/layouts/Header";
import { IconCircleFilled } from "@tabler/icons-react";
import { ERROR_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "@/configs/constants";
import { formatDate } from "@/utils/date";

const columns: MRT_ColumnDef<History, unknown>[] = [
  {
    accessorKey: "cashRequest",
    header: "Cash Request Code",
    size: 150,
    Cell: ({ row }) => {
      return (
        <CopyText>{row.original.cashRequest?.requestCode ?? "-"}</CopyText>
      );
    },
  },
  {
    accessorKey: "merchantReference",
    header: "Transaction ID",
    size: 150,
    Cell: ({ row }) => {
      return <CopyText>{row.original.merchantReference ?? "-"}</CopyText>;
    },
  },
  {
    accessorKey: "agentMerchantId",
    header: "Agent",
    size: 180,
    Cell: ({ row }) => {
      return row.original.agentMerchant?.merchantName;
    },
  },
  {
    accessorKey: "superAgentId",
    header: "Super Agent",
    size: 150,
    Cell: ({ row }) => {
      return row.original.superAgent?.merchantName;
    },
  },
  {
    accessorKey: "collectedDate",
    header: "Collected Date",
    size: 200,
    Cell: ({ row }) => {
      return row.original.collector?.collectedDate
        ? formatDate(row.original.collector?.collectedDate)
        : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 150,
    Cell: ({ row }) => {
      let c: string;

      switch (row.original.status) {
        case "PENDING":
          c = WARNING_COLOR;
          break;
        case "FAILED":
          c = ERROR_COLOR;
          break;
        default:
          c = SUCCESS_COLOR;
          break;
      }

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
];

export function PaymentList() {
  const { data, isFetching, isRefetching } = useGetHistory();

  return (
    <>
      <Header title="Stores" />
      <DataTable<History>
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
