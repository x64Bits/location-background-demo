import { Box, Button } from "native-base";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { getLocation, useLocation } from "../../hooks/use-location";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import { StateContext } from "../../store";
import { ScreenNames } from "../../constants/screens";

export default function LocationScreen() {
  const { dispatch } = useContext(StateContext);
  const { error, location } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (location) {
      dispatch({
        type: "updateLocation",
        payload: location,
      });

      navigation.navigate(ScreenNames.HOME);
    }
  }, [location]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Box>
        {error && (
          <Text style={styles.description}>Please enable Location</Text>
        )}
        <Text style={styles.description}>Please enable Location</Text>
        <Button
          disabled={!error && !location}
          style={styles.enableButton}
          onPress={getLocation}
        >
          Enable
        </Button>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 25,
  },
  enableButton: {
    marginTop: 25,
  },
  errorDescription: {
    color: "#f15353",
    fontSize: 25,
  },
});
