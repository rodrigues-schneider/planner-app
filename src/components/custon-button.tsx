import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { fonts, colors } from "../themes/themes";
import {
  FontAwesomeIconName,
  FontAwesome,
} from "@react-native-vector-icons/fontawesome";

type CustonButtonProps = TouchableOpacityProps & {
  text: string;
  textColor?: string;
  icon?: FontAwesomeIconName;
  isDisabled?: boolean;
};

export default function CustonButton({
  text,
  textColor,
  icon,
  onPress,
  isDisabled,
  ...touchableOpacityProps
}: CustonButtonProps) {
  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      style={[
        styles.container,
        isDisabled && { backgroundColor: colors.Accent },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {icon && (
        <FontAwesome
          name={icon}
          style={[styles.icon, isDisabled && { color: colors.Muted }]}
        />
      )}
      <Text style={[styles.text, isDisabled && { color: colors.Muted }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "85%",
    height: 50,
    backgroundColor: colors.Primary,
    borderRadius: 10,
    shadowColor: colors.Foreground,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },

  text: {
    fontSize: 20,
    fontFamily: fonts.MEDIUM,
    color: colors.Muted,
  },

  icon: {
    fontSize: 20,
    transform: [{ translateY: 1 }],
  },
});
