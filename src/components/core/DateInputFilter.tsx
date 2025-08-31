import { useParamsHelper } from "@/hooks/useParamHelper";
import { DateInput, DateInputProps } from "@mantine/dates";
import dayjs from "dayjs";

type DateInputFilterProps = DateInputProps & {
  param: string;
  placeholder?: string;
};

export function DateInputFilter({
  param,
  placeholder,
  ...props
}: DateInputFilterProps) {
  const { setParam, getParam } = useParamsHelper();

  const handleChange = (value: Date | null) => {
    if (!value) return setParam(param, undefined);
    const temp = dayjs(value).format("YYYY-MM-DD");
    setParam(param, temp);
  };

  return (
    <DateInput
      maxDate={new Date()}
      defaultValue={
        getParam(param)
          ? dayjs(getParam(param)).toDate()
          : dayjs(new Date()).toDate()
      }
      placeholder={placeholder}
      onChange={handleChange}
      {...props}
    />
  );
}
