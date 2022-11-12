import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

export interface ILocation {
  latitude: number;
  longitude: number;
}

interface State {
  location: ILocation | null;
}

interface Props {
  children: ReactNode;
}

interface IAction {
  type: string;
  payload: any;
}

interface IContext {
  state: State;
  dispatch: Dispatch<any>;
}

const initialState = { location: null };

function reducer(state: State, action: IAction) {
  switch (action.type) {
    case "updateLocation":
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

export const StateContext = createContext<IContext>({
  state: initialState,
  dispatch: () => {},
});

export default function StateProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export const getState = () => {
  return useContext(StateContext).state;
};
