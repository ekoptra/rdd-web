import dayjs from "dayjs";

export const formatDate = (date: Date, format = "dddd, D MMMM YYYY h:mm A") => {
  return dayjs(date).format(format);
};
