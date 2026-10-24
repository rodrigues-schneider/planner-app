import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { fonts, colors } from "./src/themes/themes";
import { usePlannerData, PlannerContextProvider } from "./src/contexts";

import { Routes } from "./src/routes/";
import ToastManager from "toastify-react-native";

function AppContent() {
  //Carrega as Fontes
  const [fontsLoaded] = useFonts({
    [fonts.LIGHT]: require("./src/assets/fonts/AsapSharp_Condensed-Light.ttf"),
    [fonts.MEDIUM]: require("./src/assets/fonts/AsapSharp_Condensed-Medium.ttf"),
    [fonts.SEMIBOLD]: require("./src/assets/fonts/AsapSharp_Condensed-SemiBold.ttf"),
    [fonts.BOLD]: require("./src/assets/fonts/AsapSharp_Condensed-Bold.ttf"),
  });

  const { dbLoaded } = usePlannerData();

  if (!fontsLoaded || !dbLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.Primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Routes />
      <ToastManager />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <PlannerContextProvider>
      <AppContent />
    </PlannerContextProvider>
  );
}
