import { styled } from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./themes";

export const Background = styled(SafeAreaView)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${colors.Background};
`;
