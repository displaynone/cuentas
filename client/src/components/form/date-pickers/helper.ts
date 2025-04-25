import { enGB } from "date-fns/locale/en-GB";

export const getValueByKey = (language: string) => {
  switch (language) {
    case "en":
      return enGB;
    default:
      return enGB;
  }
};
