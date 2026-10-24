import { Text } from "react-native";
import { useState } from "react";

import { CustonCalendar, Header, TaskPlacer } from "../components";
import { Background } from "../themes";
import { DataHandler } from "../services";

export default function CalendarScreen() {
  const today = DataHandler.formatedToday();

  const [selectedDate, setSelectedDate] = useState<string>(today);

  return (
    <Background>
      <Header title="Calendário de tarefas" subtitle="Selecione uma data" />

      <CustonCalendar
        selectedDate={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <Text>Selecionada: {selectedDate}</Text>
      <TaskPlacer selectedDate={selectedDate} />
    </Background>
  );
}
