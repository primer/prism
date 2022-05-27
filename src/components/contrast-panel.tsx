import { Box } from "@primer/react";
import { getContrast } from "color2k";
import { getContrastScore } from "../utils";
import { VStack } from "./stack";

type ContrastPanelProps = {
  color1: string;
  color2: string;
};

export function ContrastPanel({ color1, color2 }: ContrastPanelProps) {
  const contrast = getContrast(color1, color2);
  return (
    <VStack spacing={8}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div
          style={{
            color: color2,
            backgroundColor: color1,
            padding: "8px 16px",
            textAlign: "center",
            fontSize: 24,
            borderRadius: 4,
          }}
        >
          Aa
        </div>
        <div
          style={{
            color: color1,
            backgroundColor: color2,
            padding: "8px 16px",
            textAlign: "center",
            fontSize: 24,
          }}
        >
          Aa
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 14 }}>{contrast.toFixed(2)}</div>
        <div style={{ fontSize: 14 }}>{getContrastScore(contrast)}</div>
      </Box>
    </VStack>
  );
}
