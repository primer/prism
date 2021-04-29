import { Link, navigate, RouteComponentProps } from "@reach/router";
import React from "react";
import { useGlobalState } from "../global-state";

export function Palette({
  paletteId = "",
}: RouteComponentProps<{ paletteId: string }>) {
  const [state, send] = useGlobalState();
  const palette = state.context.palettes[paletteId];

  if (!palette) {
    return (
      <div>
        <p>Palette not found</p>
        <Link to="/">Go home</Link>
      </div>
    );
  }

  return (
    <div>
      <span>{palette.name}</span>
      <button
        onClick={() => {
          send({ type: "DELETE_PALETTE", paletteId: palette.id });

          // Navigate to home page after deleting a palette
          navigate("/");
        }}
      >
        Delete palette
      </button>
    </div>
  );
}
