import { Box, Text } from "@primer/react";

export function SidebarPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Text sx={{ fontWeight: "bold", mb: 2, display: "block" }}>{title}</Text>
      <Box>{children}</Box>
    </Box>
  );
}
