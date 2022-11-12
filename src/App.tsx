import { NativeBaseProvider } from "native-base";
import React from "react";
import Routes from "./Router";
import registerRootComponent from "expo/build/launch/registerRootComponent";
import StateProvider from "./store";

export default function App() {
  return (
    <NativeBaseProvider>
      <StateProvider>
        <Routes />
      </StateProvider>
    </NativeBaseProvider>
  );
}

registerRootComponent(App);
