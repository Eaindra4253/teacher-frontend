import { ERROR_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "@/configs/constants";

export function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return WARNING_COLOR;
    case "COMPLETED":
      return SUCCESS_COLOR;
    case "CANCELLED":
    case "FAILED":
      return ERROR_COLOR;
    default:
      return "unset";
  }
}
