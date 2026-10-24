import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

import { useMemo, useState } from "react";

import { colors, fonts } from "../themes/themes";
import { usePlannerData } from "../contexts";
import { PlannerTask, DataHandler } from "../services";
import TaskContainer from "./task-container";

type TaskPlacerProps = {
  selectedDate: string;
};

export default function TaskPlacer({ selectedDate }: TaskPlacerProps) {
  const { categories, tasks } = usePlannerData();

  const categoryList: string[] = [
    "Todas",
    ...categories.map((c) => c.category_name),
  ];

  const [selectedFilter, setSelectedFilter] = useState("Todas");

  const filtredTasks = useMemo(() => {
    return DataHandler.filterTaksByCategory(tasks, selectedFilter).filter(
      (task) => task.date === selectedDate,
    );
  }, [tasks, selectedFilter, selectedDate]);

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 10 }}
        contentContainerStyle={{ gap: 5 }}
        data={categoryList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={
              selectedFilter === item
                ? styles.selectedContainer
                : styles.container
            }
            onPress={() => setSelectedFilter(item)}
          >
            <Text
              style={
                selectedFilter === item ? styles.selectedText : styles.text
              }
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ padding: 10 }}
        contentContainerStyle={{ gap: 5 }}
        data={filtredTasks}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? `${item.name}-${index}`
        }
        renderItem={({ item }) => (
          <TaskContainer
            task={item}
            onCheckPress={() => {
              // Chamar aqui a função que atualiza
              // a conclusão da tarefa no contexto/SQLite.
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 100,
    borderRadius: 30,
    borderColor: colors.Secondary,
    borderWidth: 1,
  },

  selectedContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 80,
    borderRadius: 30,
    backgroundColor: colors.Secondary,
  },

  text: {
    fontSize: 15,
    color: colors.Secondary,
    fontFamily: fonts.MEDIUM,
  },

  selectedText: {
    fontSize: 15,
    fontFamily: fonts.MEDIUM,
    color: colors.Background,
  },

  taskContainer: {
    justifyContent: "center",
    width: 350,
    height: 100,
  },
});
