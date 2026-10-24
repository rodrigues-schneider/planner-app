import { TaskPlacer, Header, CustonButton } from "../components/";

import { Background } from "../themes/styled";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NativeStackParamList } from "../routes/project.routes";
import { DataHandler } from "../services";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  NativeStackParamList,
  "Main"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const goToRegisterScreen = () => {
    navigation.navigate("Register");
  };
  return (
    <Background>
      <Header title="Tarefas de hoje" />
      <TaskPlacer selectedDate={DataHandler.formatedToday()} />
      <CustonButton
        text="Nova Tarefa"
        icon="plus"
        onPress={goToRegisterScreen}
      />
    </Background>
  );
}
