import React from "react";
import { NativeBaseProvider } from "native-base";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import HomeScreen from "../../src/screens/Home";
import { StateContext } from "../../src/store";

const INPUT_CONTAINER_ID = /-input/;
const DISTANCE_CONTAINER_ID = "distance-container";

const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe("<Home /> screen", () => {
  it("display coord input fields", async () => {
    render(
      <NativeBaseProvider initialWindowMetrics={inset}>
        <HomeScreen />
      </NativeBaseProvider>
    );

    const fields = screen.getAllByTestId(INPUT_CONTAINER_ID, {
      exact: false,
    });

    expect(fields).toHaveLength(2);
  });

  it("be valid coordinate values", () => {
    // The intention of this test is to validate valid coordinate values entered in the text fields,
    // it is possible to improve this test if we implement valid Regex conditions
    // for Longitude and Latitude separately since there are differences between them,
    // but it is a general approach for validation.

    const validValue = "-66.727345";
    const wrongValue = "-66.7+=2|7ds345{";

    render(
      <NativeBaseProvider initialWindowMetrics={inset}>
        <HomeScreen />
      </NativeBaseProvider>
    );

    const fields = screen.getAllByTestId(INPUT_CONTAINER_ID, {
      exact: false,
    });

    fields.forEach((input) => {
      waitFor(() => {
        fireEvent.changeText(input, wrongValue);
      });

      const inputValue = input._fiber.stateNode.props.value;

      expect(inputValue).toEqual(validValue);
    });
  });

  it("Display distance container on valid coordinate values", () => {
    const distanceCoords = ["-36.871838", "174.768605"];
    const location = {
      latitude: "-36.853089",
      longitude: "174.870104",
    };

    render(
      <NativeBaseProvider initialWindowMetrics={inset}>
        <StateContext.Provider value={{ state: { location } }}>
          <HomeScreen />
        </StateContext.Provider>
      </NativeBaseProvider>
    );

    const fields = screen.getAllByTestId(INPUT_CONTAINER_ID, {
      exact: false,
    });

    waitFor(() => {
      fields.forEach((input, index) => {
        fireEvent.changeText(input, distanceCoords[index]);
      });
    });

    const distanceInstance = screen.getByTestId(DISTANCE_CONTAINER_ID);

    expect(distanceInstance).toBeDefined();
  });
});
