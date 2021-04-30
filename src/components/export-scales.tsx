import copy from "copy-to-clipboard";
import React from "react";
import { Palette } from "../types";
import { colorToHex } from "../utils";
import { Button } from "./button";
import * as Dialog from "./dialog";
import { VStack } from "./stack";
import { Textarea } from "./textarea";

type ExportScalesProps = {
  palette: Palette;
};

export function ExportScales({ palette }: ExportScalesProps) {
  const hexScales = React.useMemo(
    () =>
      Object.values(palette.scales).reduce<Record<string, string[]>>(
        (acc, scale) => {
          // TODO: add curve values
          acc[scale.name] = scale.colors.map(colorToHex);
          return acc;
        },
        {}
      ),
    [palette.scales]
  );

  const code = React.useMemo(() => JSON.stringify(hexScales, null, 2), [
    hexScales,
  ]);

  return (
    <Dialog.Root>
      <Dialog.Trigger as={Button}>Export scales</Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 16,
            borderBottom: "1px solid gainsboro",
          }}
        >
          <span>Export scales</span>
          <Dialog.Close as={Button}>Close</Dialog.Close>
        </div>
        <VStack spacing={16} style={{ padding: 16 }}>
          <Textarea
            aria-label="Copy JSON"
            rows={12}
            value={code}
            style={{ fontFamily: "monospace" }}
            readOnly
            disabled
          />
          <Button onClick={() => copy(code)}>Copy to clipboard</Button>
        </VStack>
      </Dialog.Content>
    </Dialog.Root>
  );
}
