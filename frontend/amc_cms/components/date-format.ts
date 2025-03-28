import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatDateTime = (date: string) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};
