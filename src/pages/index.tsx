import React from "react";
import { useGlobalState } from "../global-state";

export function Index() {
  const [state, send] = useGlobalState();
  return (
    <div>
      <ul>
        {Object.values(state.context.palettes).map(palette => (
          <li key={palette.id}>{palette.name}</li>
        ))}
      </ul>
      <button onClick={() => send("CREATE_PALETTE")}>Create palette</button>
    </div>
  );
}
