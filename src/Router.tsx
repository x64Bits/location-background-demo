import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/Home";
import LocationScreen from "./screens/Location";
import { ScreenNames } from "./constants/screens";

export interface RootStackParamList {
  Home: undefined;
  Location: undefined;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ScreenNames.LOCATION}>
        <Stack.Screen name={ScreenNames.HOME} component={HomeScreen} />
        <Stack.Screen name={ScreenNames.LOCATION} component={LocationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
