import { Box, Input, Text } from "native-base";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { getDistance } from "geolib";
import { SafeAreaView, StyleSheet } from "react-native";

import { StateContext } from "../../store";
import LocationButton from "../../components/LocationButton";

export default function HomeScreen() {
  const { state } = useContext(StateContext);
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();

  const distance = useMemo(() => {
    if (!latitude && !longitude) {
      return;
    }
    if (state.location) {
      return getDistance(state.location, {
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    }
  }, [latitude, longitude]);

  const setAsNumber = (value: string, changeFn: React.Dispatch<string>) => {
    const validValue = value.replace(/[^0-9\.\-]+/g, "");
    changeFn(validValue);
  };

  const handleChangeLatitude = useCallback(
    (text: string) => setAsNumber(text, setLatitude),
    []
  );
  const handleChangeLongitude = useCallback(
    (text: string) => setAsNumber(text, setLongitude),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box px={3}>
        <Box pt={5}>
          <Text fontSize={20}>Latitude</Text>
          <Input
            w="100%"
            h={12}
            bg={styles.input.backgroundColor}
            onChangeText={handleChangeLatitude}
            value={latitude}
            keyboardType="number-pad"
            testID="latitude-input"
          />
        </Box>
        <Box pt={5}>
          <Text fontSize={20}>Longitude</Text>
          <Input
            w="100%"
            h={12}
            bg={styles.input.backgroundColor}
            onChangeText={handleChangeLongitude}
            value={longitude}
            keyboardType="number-pad"
            testID="longitude-input"
          />
        </Box>
      </Box>
      {!!distance && (
        <Box
          justifyContent="center"
          alignItems="center"
          mt={10}
          testID="distance-container"
        >
          <Text>
            You are{" "}
            <Text fontWeight={600} fontSize={22}>
              {distance}
            </Text>{" "}
            mts far from that coordinate
          </Text>
          <Box px={5} mt={5}>
            <LocationButton longitude={longitude} latitude={latitude} />
          </Box>
        </Box>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingHorizontal: 20,
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  input: {
    backgroundColor: "#FFF",
  },
});
