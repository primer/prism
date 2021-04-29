import { useInterpret, useService } from "@xstate/react";
import React from "react";
import { interpret, Machine } from "xstate";
import { Palette } from "./types";

const GLOBAL_STATE_KEY = "global_state";

type MachineContext = {
  palettes: Record<string, Palette>;
};

type MachineEvent = { type: "CREATED_PALETTE" };

const machine = Machine<MachineContext, MachineEvent>({
  id: "global-state",
  context: {
    palettes: {},
  },
});

const GlobalStateContext = React.createContext(interpret(machine));

export function GlobalStateProvider({ children }: React.PropsWithChildren<{}>) {
  const initialState = React.useMemo(
    () => getPersistedState() ?? machine.initialState,
    []
  );

  const service = useInterpret(machine, { state: initialState }, state => {
    localStorage.setItem(GLOBAL_STATE_KEY, JSON.stringify(state));
  });

  return (
    <GlobalStateContext.Provider value={service}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useService(React.useContext(GlobalStateContext));
}

function getPersistedState(): typeof machine.initialState | null {
  try {
    return JSON.parse(localStorage.getItem(GLOBAL_STATE_KEY) ?? "");
  } catch (e) {
    return null;
  }
}
