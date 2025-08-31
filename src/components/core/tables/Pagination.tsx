import { PageSizeSelect } from "@/components/core/selects/PageSizeSelect";
import { useParamsHelper } from "@/hooks/useParamHelper";
import { Box, Group, Pagination as MantinePagination } from "@mantine/core";

export function Pagination({ total = 1 }: { total: number }) {
  const { getParam, setParams } = useParamsHelper();

  const totalPage = Math.ceil(total / Number(getParam("limit") ?? "10"));

  return (
    <Group justify="flex-end" p="sm">
      <Box>Total : {total}</Box>
      <Box>
        <PageSizeSelect />
      </Box>
      <MantinePagination
        size="sm"
        boundaries={1}
        radius="xl"
        siblings={1}
        value={Number(getParam("page") ?? "1")}
        total={totalPage}
        onChange={(index) => setParams({ page: index.toString() })}
      />
    </Group>
  );
}
