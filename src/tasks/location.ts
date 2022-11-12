import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as Location from "expo-location";
import { TaskManagerTaskBody } from "expo-task-manager";
import { getDistance } from "geolib";
import { AppState, Platform } from "react-native";
import { REFERENCE_LOCATION_KEY } from "../constants/store";

const LIMIT_DISTANCE = 1000;
const INTERVAL_TIME = 5000;

let alert: Audio.Sound | null;
let timeout: ReturnType<typeof setInterval>;

function clearAlert() {
  console.log("cleaning alert");
  alert?.unloadAsync();
  alert = null;
  clearInterval(timeout);
}

async function showNotification() {
  if (Platform.OS === "ios" || AppState.currentState === "active") {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
    });
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/limits-sound.mp3")
    );

    alert = sound;

    await alert.setPositionAsync(0);
    await alert.playAsync();
  }
}

export default async function locationTask({
  data,
  error,
}: TaskManagerTaskBody<{ locations?: Location.LocationObject[] }>) {
  const storedLocation = await AsyncStorage.getItem(REFERENCE_LOCATION_KEY);

  if (error) {
    console.log({ error });
    return;
  }

  if (data.locations && storedLocation) {
    const location = data?.locations[0];
    const referenceLocation = JSON.parse(storedLocation);

    const distance = getDistance(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      referenceLocation
    );

    console.log({ distance });
    if (distance >= LIMIT_DISTANCE) {
      timeout = setInterval(showNotification, INTERVAL_TIME);
    }

    if (alert && distance <= LIMIT_DISTANCE) {
      clearAlert();
    }
  }
}
