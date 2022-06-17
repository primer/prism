import {
  LinkExternalIcon,
  MarkGithubIcon,
  PlusIcon,
  TrashIcon,
} from "@primer/octicons-react";
import {
  Box,
  Button,
  Heading,
  IconButton,
  Label,
  Link as PrimerLink,
  StyledOcticon,
  Text,
} from "@primer/react";
import { Link, RouteComponentProps } from "@reach/router";
import { readableColor } from "color2k";
import React from "react";
import { routePrefix } from "../constants";
import { useGlobalState } from "../global-state";
import { colorToHex, getColor } from "../utils";

export function Index(props: RouteComponentProps) {
  const [state, send] = useGlobalState();
  return (
    <div>
      <Box
        as="header"
        sx={{
          p: 3,
          bg: "canvas.default",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MarkGithubIcon size={32} />
          <Box as="h1" sx={{ m: 0, mx: 2, fontSize: 3, fontWeight: "bold" }}>
            Primer Prism
          </Box>
          <Label variant="attention">Experimental</Label>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PrimerLink
            muted
            href="https://github.com/primer/prism"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 4, "&:hover": { textDecoration: "underline" } }}
          >
            GitHub
            <StyledOcticon icon={LinkExternalIcon} sx={{ marginLeft: 1 }} />
          </PrimerLink>
          <IconButton
            aria-label="Create new palette"
            icon={PlusIcon}
            onClick={() => send("CREATE_PALETTE")}
            sx={{ margin: 0 }}
          />
        </Box>
      </Box>
      <Box sx={{ p: 3 }}>
        <Box
          as="ul"
          sx={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "grid",
            gap: 3,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {Object.values(state.context.palettes).map(palette => (
            <li key={palette.id}>
              <Box
                as={Link}
                to={`${routePrefix}/local/${palette.id}`}
                sx={{
                  display: "grid",
                  gap: 3,
                  p: 3,
                  textDecoration: "none",
                  borderRadius: 2,
                  // border: "1px solid",
                  // borderColor: "border.default",
                  overflow: "hidden",
                  color: readableColor(palette.backgroundColor),
                  backgroundColor: palette.backgroundColor,
                }}
              >
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "flex",
                    height: 160,
                    gap: 3,
                  }}
                >
                  {Object.values(palette.scales).map(scale => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        color: readableColor(palette.backgroundColor),
                        backgroundColor: palette.backgroundColor,
                        height: "100%",
                        width: "100%",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                      key={scale.id}
                    >
                      {scale.colors.map((_, index) => {
                        const color = getColor(palette.curves, scale, index);
                        return (
                          <Box
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: colorToHex(color),
                            }}
                          />
                        );
                      })}
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Text sx={{ lineHeight: "1" }}>{palette.name}</Text>
                  <IconButton
                    aria-label="Delete palette"
                    icon={TrashIcon}
                    onClick={(e: PointerEvent) => {
                      send({ type: "DELETE_PALETTE", paletteId: palette.id })
                      e.preventDefault()
                    }}
                  />
                </Box>
              </Box>
            </li>
          ))}
        </Box>
      </Box>
      {/* Empty state */}
      {Object.keys(state.context.palettes).length === 0 ? (
        <Box
          sx={{
            height: "70vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
              maxWidth: "50ch",
            }}
          >
            <Heading as="h2" sx={{ marginBottom: 1 }}>
              Welcome
            </Heading>
            <Text sx={{ marginBottom: 5, fontSize: 3, color: "fg.muted" }}>
              Primer Prism is a tool for creating cohesive, consistent, and
              accessible color palettes
            </Text>
            <Button
              variant="primary"
              size="large"
              onClick={() => send("CREATE_PALETTE")}
            >
              Create new palette
            </Button>
          </Box>
        </Box>
      ) : null}
    </div>
  );
}
