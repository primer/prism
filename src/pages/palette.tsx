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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottom: "1px solid lightgray",
        }}
      >
        <input
          type="text"
          aria-label="Palette name"
          value={palette.name}
          onChange={event =>
            send({
              type: "CHANGE_PALETTE_NAME",
              paletteId: palette.id,
              name: event.target.value,
            })
          }
        />
        <button
          onClick={() => {
            send({ type: "DELETE_PALETTE", paletteId: palette.id });

            // Navigate to home page after deleting a palette
            navigate("/");
          }}
        >
          Delete palette
        </button>
      </header>
    </div>
  );
}
