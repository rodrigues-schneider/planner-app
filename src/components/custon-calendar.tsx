import { Text, TextStyle } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import type { CalendarProps } from "react-native-calendars";

import { colors, fonts } from "../themes";
import { usePlannerData } from "../contexts";
import { MarkedDates } from "react-native-calendars/src/types";

type CustonCalendarProps = CalendarProps & {
  selectedDate: string;
  label?: string;
  labelStyle?: TextStyle;
};

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Fev.",
    "Mar.",
    "Abr.",
    "Mai.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."],
  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt-br";

export default function CustonCalendar({
  selectedDate,
  label,
  labelStyle,
  ...calendarProp
}: CustonCalendarProps) {
  const { dates } = usePlannerData();

  const dotedDates: MarkedDates = {};

  dates.forEach((date) => {
    dotedDates[date] = {
      marked: true,
      dotColor: colors.Secondary,
    };
  });

  const markedDates: MarkedDates = {
    ...dotedDates,
    [selectedDate]: {
      ...dotedDates[selectedDate],
      selected: true,
    },
  };

  return (
    <>
      {label && (
        <Text
          style={[
            { fontFamily: fonts.MEDIUM, color: colors.Secondary, fontSize: 18 },
            { ...labelStyle },
          ]}
        >
          {label}
        </Text>
      )}
      <Calendar
        {...calendarProp}
        enableSwipeMonths={true}
        markingType="dot"
        markedDates={markedDates}
        style={{
          alignSelf: "center",
          width: "95%",
          paddingBottom: 5,
        }}
        theme={{
          backgroundColor: colors.Background,
          calendarBackground: colors.Background,

          selectedDayBackgroundColor: colors.Primary,
          selectedDayTextColor: colors.Foreground,

          todayTextColor: colors.Primary,
          dayTextColor: colors.Foreground,
          selectedDotColor: colors.Border,
          arrowColor: colors.Foreground,
          disabledArrowColor: colors.Muted,
          monthTextColor: colors.Primary,
          indicatorColor: colors.Primary,

          textDayFontFamily: fonts.LIGHT,
          textMonthFontFamily: fonts.SEMIBOLD,
          textDayHeaderFontFamily: fonts.BOLD,

          textDayFontSize: 15,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
      />
    </>
  );
}
