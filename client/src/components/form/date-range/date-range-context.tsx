import { addMonths } from "date-fns";
import { createContext, useState, ReactNode } from "react";

type DateRangeContextProps = {
  leftDate: Date;
  rightDate: Date;
  setLeftDate: (date: Date) => void;
  setRightDate: (date: Date) => void;
};

export const DateRangeContext = createContext<DateRangeContextProps>({
  leftDate: new Date(),
  rightDate: addMonths(new Date(), 1),
  setLeftDate: () => {},
  setRightDate: () => {},
});

type DateRangeProviderProps = {
  children: ReactNode;
};

export const DateRangeProvider = ({ children }: DateRangeProviderProps) => {
  const [leftDate, setLeftDate] = useState<Date>(new Date());
  const [rightDate, setRightDate] = useState<Date>(addMonths(new Date(), 1));

  return (
    <DateRangeContext.Provider
      value={{ leftDate, rightDate, setLeftDate, setRightDate }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};
