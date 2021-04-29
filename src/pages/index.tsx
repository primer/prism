import { Link, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { useGlobalState } from "../global-state";

export function Index(props: RouteComponentProps) {
  const [state, send] = useGlobalState();
  return (
    <div>
      <ul>
        {Object.values(state.context.palettes).map(palette => (
          <li key={palette.id}>
            <Link to={`/${palette.id}`}>{palette.name}</Link>
          </li>
        ))}
      </ul>
      <Button onClick={() => send("CREATE_PALETTE")}>Create palette</Button>
    </div>
  );
}
