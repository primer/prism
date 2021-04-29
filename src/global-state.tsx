import { assign } from "@xstate/immer";
import { useInterpret, useService } from "@xstate/react";
import React from "react";
import { v4 as uniqueId } from "uuid";
import { interpret, Machine } from "xstate";
import { Palette } from "./types";

const GLOBAL_STATE_KEY = "global_state";

type MachineContext = {
  palettes: Record<string, Palette>;
};

type MachineEvent =
  | { type: "CREATE_PALETTE" }
  | { type: "DELETE_PALETTE"; paletteId: string }
  | { type: "CHANGE_PALETTE_NAME"; paletteId: string; name: string };

const machine = Machine<MachineContext, MachineEvent>({
  id: "global-state",
  context: {
    palettes: {},
  },
  on: {
    CREATE_PALETTE: {
      actions: assign(context => {
        const paletteId = uniqueId();
        context.palettes[paletteId] = {
          id: paletteId,
          name: "Untitled",
        };
      }),
    },
    DELETE_PALETTE: {
      actions: assign((context, event) => {
        delete context.palettes[event.paletteId];
      }),
    },
    CHANGE_PALETTE_NAME: {
      actions: assign((context, event) => {
        context.palettes[event.paletteId].name = event.name;
      }),
    },
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
