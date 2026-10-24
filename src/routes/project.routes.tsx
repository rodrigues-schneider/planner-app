import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";

import { HomeScreen, CalendarScreen, RegisterScreen } from "../screens";
import FontAwesome, {
  FontAwesomeIconName,
} from "@react-native-vector-icons/fontawesome";
import { colors } from "../themes";
import { View, Text } from "react-native";

export type BottomTabParamList = {
  Home: undefined;
  Calendar: undefined;
};

export type NativeStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  Register: undefined;
};

const tab = createBottomTabNavigator<BottomTabParamList>();

const stack = createNativeStackNavigator<NativeStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
}

function BottonTabsRoutes() {
  return (
    <tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: colors.Accent,
        tabBarActiveTintColor: colors.Foreground,
        tabBarStyle: {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.Background,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Tarefas de hoje",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="tasks" focused={focused} />
          ),
        }}
      />
      <tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "Calendário",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="calendar" focused={focused} />
          ),
        }}
      />
    </tab.Navigator>
  );
}

function StackRoutes() {
  return (
    <stack.Navigator screenOptions={{ headerShown: false }}>
      <stack.Screen name="Main" component={BottonTabsRoutes} />
      <stack.Screen name="Register" component={RegisterScreen} />
    </stack.Navigator>
  );
}

type TabIconProps = {
  name: FontAwesomeIconName;
  focused: boolean;
};

const TabIcon = ({ name, focused }: TabIconProps) => (
  <View
    style={{
      justifyContent: "center",
      alignItems: "center",
      height: 30,
      width: 60,
      backgroundColor: focused ? colors.Primary : colors.Background,
      borderRadius: 20,
    }}
  >
    <FontAwesome
      name={name}
      size={20}
      color={focused ? colors.Secondary : colors.Accent}
    />
  </View>
);
