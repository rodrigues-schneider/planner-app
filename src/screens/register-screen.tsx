import { ScrollView } from "react-native";
import { useState } from "react";

import { Toast } from "toastify-react-native";
import {
  Header,
  CustonButton,
  CustonInput,
  CustonDropdown,
  CustonCalendar,
} from "../components";
import { Background } from "../themes";
import { usePlannerData } from "../contexts";
import { colors, fonts } from "../themes";
import { DataHandler, CreatePlannerTaskDTO, DbManager } from "../services";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const navigation = useNavigation();

  const { categories, places, updateContextLists } = usePlannerData();

  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState(DataHandler.formatedToday());
  const [taskHour, setTaskHour] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskPlace, setTaskPlace] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const dropdownCategories = categories.map((category) =>
    category.category_name.toString(),
  );
  const dropdownPlaces = places.map((place) => place.place_name.toString());

  const isDisabled = !taskName || !taskDate || !taskHour;

  const handleNewTask = async () => {
    try {
      const newTask: CreatePlannerTaskDTO = {
        name: taskName,
        date: taskDate,
        hour: taskHour,
        category: taskCategory || null,
        description: taskDescription || null,
        place: taskPlace || null,
        completed: false,
      };

      const db = await DbManager.initDB();

      await db.insertNewTask(newTask);

      await updateContextLists();

      Toast.show({
        type: "success",
        text1: "Tarefa criada!",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
        textColor: colors.Primary,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao cadastrar tarefa:", error);

      Toast.show({
        type: "error",
        text1: "Erro ao criar tarefa",
        text2: "Não foi possível salvar a atividade.",
        position: "top",
      });
    }
  };

  return (
    <Background>
      <Header title="Nova Tarefa" subtitle="Registre a nova atividade" />
      <CustonCalendar
        label="Data"
        selectedDate={taskDate}
        onDayPress={(day) => setTaskDate(day.dateString)}
        labelStyle={{
          fontFamily: fonts.MEDIUM,
          fontSize: 16,
          color: colors.Secondary,
          paddingHorizontal: 15,
          marginBottom: 5,
        }}
      />
      <ScrollView style={{ flex: 1 }}>
        <CustonInput
          label="Nome da tarefa"
          value={taskName}
          onChangeText={(text) => setTaskName(text)}
        />
        <CustonDropdown
          label="Horário"
          dropdownItemListData={DataHandler.availableHours(taskDate)}
          value={taskHour}
          onChange={(item) => setTaskHour(item)}
        />
        <CustonDropdown
          label="Categoria (Opcional)"
          dropdownItemListData={dropdownCategories}
          value={taskCategory}
          onChange={(item) => setTaskCategory(item)}
        />
        <CustonDropdown
          label="Local (Opcional)"
          dropdownItemListData={dropdownPlaces}
          value={taskPlace}
          onChange={(item) => setTaskPlace(item)}
        />
        <CustonInput
          label="Descrição (Opcional)"
          multiline={true}
          value={taskDescription}
          onChangeText={(text) => setTaskDescription(text)}
        />
      </ScrollView>

      <CustonButton
        text="Salvar Atividade"
        icon="check"
        onPress={handleNewTask}
        disabled={isDisabled}
        isDisabled={isDisabled}
      />
    </Background>
  );
}
