import { LocationAccuracy, LocationObject } from "expo-location";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { ILocation } from "../store";

export async function getLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    return "Permission to access location was denied";
  }

  let location = await Location.getCurrentPositionAsync({
    accuracy: LocationAccuracy.High,
  });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

export function useLocation() {
  const [location, setLocation] = useState<ILocation | null>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      const currentLocation = await getLocation();
      if (typeof currentLocation !== "string") {
        setLocation(currentLocation);
        return;
      }

      setError(currentLocation);
    })();
  }, []);

  return { location, error };
}
