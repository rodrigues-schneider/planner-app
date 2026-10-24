import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React, { useState } from "react";
import { PlannerTask, TaskCategory } from "../services";
import { usePlannerData } from "../contexts";
import { colors, fonts } from "../themes";
import FontAwesome from "@react-native-vector-icons/fontawesome/static";

type TaskContainerProps = TouchableOpacityProps & {
  task: PlannerTask;
  onCheckPress?: () => void;
};

export default function TaskContainer({
  task,
  onCheckPress,
}: TaskContainerProps) {
  const { categories } = usePlannerData();

  const [checked, setChecked] = useState(false);

  const category: TaskCategory | undefined = categories.find(
    (c) => c.category_name === task.category,
  );

  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center", width: 30 }}
        onPress={() => {
          setChecked(!checked);
          onCheckPress?.();
        }}
      >
        <FontAwesome
          name={checked ? "check-square" : "square-o"}
          size={25}
          color={colors.Foreground}
        />
      </TouchableOpacity>
      <Text
        style={
          checked
            ? { fontFamily: fonts.BOLD, color: colors.Foreground }
            : { fontFamily: fonts.MEDIUM, color: colors.Accent }
        }
      >
        {task.name}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontFamily: fonts.LIGHT, color: colors.Secondary }}>
          {task.hour}
        </Text>
        {category?.category_icon && (
          <FontAwesome
            name={category?.category_icon}
            color={category?.category_color ?? colors.Foreground}
          />
        )}
        <Text style={{ color: category?.category_color ?? colors.Foreground }}>
          {category?.category_name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    justifyContent: "center",
    width: 350,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.Border,
    shadowColor: colors.Accent,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
});
