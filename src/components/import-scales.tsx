import { keyBy } from "lodash-es";
import React from "react";
import { v4 as uniqueId } from "uuid";
import exampleScales from "../example-scales.json";
import { Scale } from "../types";
import { hexToColor } from "../utils";
import { Button } from "./button";
import * as Dialog from "./dialog";
import { HStack, VStack } from "./stack";
import { Textarea } from "./textarea";

const PLACEHOLDER = `{
  "gray": [
    "#eee",
    "#ddd",
    "#ccc"
  ]
}`;

type ImportScalesProps = {
  onImport: (scales: Record<string, Scale>, replace: boolean) => void;
};

export function ImportScales({ onImport }: ImportScalesProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [replace, setReplace] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const parsedCode: Record<string, string[]> = JSON.parse(code);

      const scales: Scale[] = Object.entries(parsedCode).map(
        ([name, scale]) => {
          const id = uniqueId();
          return { id, name, colors: scale.map(hexToColor) };
        }
      );

      onImport(keyBy(scales, "id"), replace);

      // Reset state
      setIsOpen(false);
      setCode("");
      setError("");
      setReplace(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger as={Button}>Import scales</Dialog.Trigger>
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
          <span>Import scales</span>
          <Dialog.Close as={Button}>Close</Dialog.Close>
        </div>
        <form onSubmit={handleSubmit}>
          <VStack spacing={16} style={{ padding: 16 }}>
            {error ? (
              <pre style={{ margin: 0, color: "firebrick" }}>{error}</pre>
            ) : null}
            <VStack spacing={4}>
              <label htmlFor="code" style={{ fontSize: 14 }}>
                Paste JSON
              </label>
              <Textarea
                id="code"
                rows={12}
                style={{ fontFamily: "monospace" }}
                placeholder={PLACEHOLDER}
                value={code}
                onChange={event => setCode(event.target.value)}
              />
            </VStack>
            <Button
              type="button"
              onClick={() => setCode(JSON.stringify(exampleScales, null, 2))}
            >
              Load example scales
            </Button>
            <HStack spacing={4}>
              <input
                type="checkbox"
                id="replace"
                checked={replace}
                onChange={event => setReplace(event.target.checked)}
              />
              <label htmlFor="replace" style={{ fontSize: 14, lineHeight: 1 }}>
                Replace existing scales
              </label>
            </HStack>
            <Button>Import</Button>
          </VStack>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
