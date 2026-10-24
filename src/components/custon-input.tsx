import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TextInputProps,
} from "react-native";
import { fonts, colors } from "../themes/themes";

type CustonInputProp = TextInputProps & {
  label?: string;
};

export default function CustonInput({
  label,
  ...textInputProps
}: CustonInputProp) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <View
        style={[
          styles.textInputContainer,
          { borderColor: focused ? colors.Primary : colors.Border },
        ]}
      >
        <TextInput
          {...textInputProps}
          style={styles.textInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "70%",
    height: 100,
    marginVertical: 10,
  },
  text: {
    fontFamily: fonts.MEDIUM,
    fontSize: 16,
    color: colors.Secondary,
    paddingHorizontal: 15,
    marginBottom: 5,
  },

  textInputContainer: {
    borderRadius: 10,
    borderWidth: 1,

    backgroundColor: colors.Background,
    shadowColor: colors.Accent,
    shadowOffset: { width: 2, height: 2 },
    elevation: 5,
  },
  textInput: {
    width: 350,
    height: 50,
    paddingHorizontal: 20,
  },
});
