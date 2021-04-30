import * as Dialog from "@radix-ui/react-dialog";
import { keyBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { v4 as uniqueId } from "uuid";
import exampleScales from "../example-scales.json";
import { Scale } from "../types";
import { hexToColor } from "../utils";
import { Button } from "./button";
import { HStack, VStack } from "./stack";
import { Textarea } from "./textarea";

const StyledOverlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const StyledContent = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  max-width: fit-content;
  max-height: 85vh;
  margin-top: -5vh;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  overflow: auto;
`;

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
      <StyledOverlay />
      <StyledContent>
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
      </StyledContent>
    </Dialog.Root>
  );
}
