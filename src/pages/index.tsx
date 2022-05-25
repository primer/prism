import { Link, RouteComponentProps } from "@reach/router";
import React from "react";
import { Button } from "../components/button";
import { VStack } from "../components/stack";
import { useGlobalState } from "../global-state";
import {routePrefix} from "../constants"

export function Index(props: RouteComponentProps) {
  const [state, send] = useGlobalState();
  return (
    <VStack spacing={16} style={{ padding: 16 }}>
      <VStack as="ul" style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {Object.values(state.context.palettes).map(palette => (
          <li key={palette.id}>
            <Link to={`${routePrefix}/${palette.id}`}>{palette.name}</Link>
          </li>
        ))}
      </VStack>
      <Button onClick={() => send("CREATE_PALETTE")}>Create palette</Button>
      <Button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Clear local storage
      </Button>
    </VStack>
  );
}
