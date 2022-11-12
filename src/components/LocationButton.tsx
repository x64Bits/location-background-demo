import React, { useCallback, useEffect, useState } from "react";
import { Button, Text } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import locationTask from "../tasks/location";
import { LOCATION_TASK } from "../constants/location";
import { REFERENCE_LOCATION_KEY } from "../constants/store";

interface Props {
  latitude?: string;
  longitude?: string;
}

function LocationButton({ latitude, longitude }: Props) {
  const [enable, setEnable] = useState(false);

  const runLocationTask = useCallback(async () => {
    setEnable(true);
    await AsyncStorage.setItem(
      REFERENCE_LOCATION_KEY,
      JSON.stringify({ latitude, longitude })
    );

    const { status } = await Location.requestBackgroundPermissionsAsync();

    if (status === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK, {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      });
    }
  }, [latitude, longitude]);

  const stopLocationTask = useCallback(async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    await AsyncStorage.removeItem(REFERENCE_LOCATION_KEY);
    setEnable(false);
  }, [latitude, longitude]);

  useEffect(() => {
    () => stopLocationTask();
  }, []);

  return (
    <Button onPress={enable ? stopLocationTask : runLocationTask}>
      <Text color="#FFF">{enable ? "Stop" : "Listen"} background location</Text>
    </Button>
  );
}

TaskManager.defineTask(LOCATION_TASK, locationTask);

export default LocationButton;
