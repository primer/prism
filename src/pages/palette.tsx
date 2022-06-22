import {MarkGithubIcon} from '@primer/octicons-react'
import {Box, Text, Label} from '@primer/react'
import {Link, navigate, RouteComponentProps} from '@reach/router'
import {mix, readableColor} from 'color2k'
import React from 'react'
import styled from 'styled-components'
import {Button, IconButton} from '../components/button'
import {ExportScales} from '../components/export-scales'
import {ImportScales} from '../components/import-scales'
import {Input} from '../components/input'
import {Separator} from '../components/separator'
import {SidebarPanel} from '../components/sidebar-panel'
import {HStack, VStack} from '../components/stack'
import {routePrefix} from '../constants'
import {useGlobalState} from '../global-state'
import {Color} from '../types'
import {colorToHex, getColor} from '../utils'

const Wrapper = styled.div<{backgroundColor: string}>`
  --color-text: ${props => readableColor(props.backgroundColor)};
  --color-background: ${props => props.backgroundColor};
  --color-background-secondary: ${props => mix(readableColor(props.backgroundColor), props.backgroundColor, 0.9)};
  --color-background-secondary-hover: ${props =>
    mix(readableColor(props.backgroundColor), props.backgroundColor, 0.85)};
  --color-border: ${props => mix(readableColor(props.backgroundColor), props.backgroundColor, 0.75)};

  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 'header header' 'sidebar main';
  color: var(--color-text);
  background-color: var(--color-background);
  height: 100vh;
`

const Main = styled.main`
  grid-area: main;
  display: flex;
  overflow: auto;

  & > * {
    flex-grow: 1;
  }
`

export function Palette({paletteId = '', children}: React.PropsWithChildren<RouteComponentProps<{paletteId: string}>>) {
  const [state, send] = useGlobalState()
  const palette = state.context.palettes[paletteId]

  if (!palette) {
    return (
      <div style={{padding: 16}}>
        <p style={{marginTop: 0}}>Palette not found</p>
        <Link to={`${routePrefix}/`}>Go home</Link>
      </div>
    )
  }

  return (
    <Wrapper backgroundColor={palette.backgroundColor}>
      <header
        style={{
          gridArea: 'header',
          display: 'flex',
          alignItems: 'center',
          // gridTemplateColumns: "repeat(3,1fr)",
          justifyContent: 'space-between',
          padding: 16,
          borderBottom: '1px solid var(--color-border, gainsboro)'
        }}
      >
        <Link
          to={`${routePrefix}/`}
          style={{
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          <Text sx={{display: 'flex', alignItems: 'center'}}>
            <MarkGithubIcon size={32} />
            <Text as="h1" sx={{m: 0, mx: 2, fontSize: 3, fontWeight: 'bold'}}>
              Primer Prism
            </Text>
            <Label
              sx={{
                color: 'var(--color-text)',
                borderColor: 'var(--color-text)'
              }}
            >
              Experimental
            </Label>
          </Text>
        </Link>

        <HStack spacing={8}>
          <IconButton
            aria-label="Undo"
            icon={() => (
              // Custom undo icon
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{verticalAlign: 'text-top'}}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5606 5.56066C12.1464 4.97487 12.1464 4.02513 11.5606 3.43934C10.9748 2.85355 10.0251 2.85355 9.43929 3.43934L2.43929 10.4393C1.85351 11.0251 1.85351 11.9749 2.43929 12.5607L9.43929 19.5607C10.0251 20.1464 10.9748 20.1464 11.5606 19.5607C12.1464 18.9749 12.1464 18.0251 11.5606 17.4393L7.12127 13H21C24.3137 13 27 15.6863 27 19C27 22.3137 24.3137 25 21 25H17.5C16.6715 25 16 25.6716 16 26.5C16 27.3284 16.6715 28 17.5 28H21C25.9705 28 30 23.9706 30 19C30 14.0294 25.9705 10 21 10H7.12127L11.5606 5.56066Z"
                />
              </svg>
            )}
            onClick={() => send('UNDO')}
            disabled={state.context.past.length === 0}
          >
            Undo
          </IconButton>
          <IconButton
            aria-label="Redo"
            icon={() => (
              // Custom redo icon
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{verticalAlign: 'text-top'}}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.4394 5.56066C19.8536 4.97487 19.8536 4.02513 20.4394 3.43934C21.0252 2.85355 21.9749 2.85355 22.5607 3.43934L29.5607 10.4393C30.1465 11.0251 30.1465 11.9749 29.5607 12.5607L22.5607 19.5607C21.9749 20.1464 21.0252 20.1464 20.4394 19.5607C19.8536 18.9749 19.8536 18.0251 20.4394 17.4393L24.8787 13H11C7.68634 13 5.00005 15.6863 5.00005 19C5.00005 22.3137 7.68634 25 11 25H14.5C15.3285 25 16 25.6716 16 26.5C16 27.3284 15.3285 28 14.5 28H11C6.02948 28 2.00005 23.9706 2.00005 19C2.00005 14.0294 6.02948 10 11 10H24.8787L20.4394 5.56066Z"
                />
              </svg>
            )}
            onClick={() => send('REDO')}
            disabled={state.context.future.length === 0}
          />
          {/* <input
            type="color"
            value={palette.backgroundColor}
            style={{
              appearance: "none",
              border: "1px solid var(--color-border, darkgray)",
              backgroundColor: "var(--color-background-secondary, gainsboro)",
              padding: "0px 2px",
              margin: 0,
              borderRadius: 3,
              height: 32,
            }}
            onChange={event =>
              send({
                type: "CHANGE_PALETTE_BACKGROUND_COLOR",
                paletteId,
                backgroundColor: event.target.value,
              })
            }
          /> */}
          <ImportScales onImport={(scales, replace) => send({type: 'IMPORT_SCALES', paletteId, scales, replace})} />
          <ExportScales palette={palette} />
        </HStack>
      </header>
      <div
        style={{
          gridArea: 'sidebar',
          overflow: 'auto',
          borderRight: '1px solid var(--color-border, gainsboro)',
          paddingBottom: 16
        }}
      >
        <SidebarPanel title="Palette">
          <VStack spacing={16}>
            <VStack spacing={4}>
              <label htmlFor="palette-name" style={{fontSize: 14}}>
                Name
              </label>
              <Input
                type="text"
                id="palette-name"
                value={palette.name}
                style={{width: '100%'}}
                onChange={event =>
                  send({
                    type: 'CHANGE_PALETTE_NAME',
                    paletteId,
                    name: event.target.value
                  })
                }
              />
            </VStack>
            <HStack spacing={8}>
              <input
                id="bg-color"
                type="color"
                value={palette.backgroundColor}
                style={{
                  appearance: 'none',
                  border: '1px solid var(--color-border, darkgray)',
                  backgroundColor: 'var(--color-background-secondary, gainsboro)',
                  padding: '0px 2px',
                  margin: 0,
                  borderRadius: 6,
                  height: 32,
                  width: 64
                }}
                onChange={event =>
                  send({
                    type: 'CHANGE_PALETTE_BACKGROUND_COLOR',
                    paletteId,
                    backgroundColor: event.target.value
                  })
                }
              />
              <label htmlFor="bg-color" style={{fontSize: 14}}>
                Background color
              </label>
            </HStack>
            <Button
              aria-label="Delete palette"
              onClick={() => {
                send({type: 'DELETE_PALETTE', paletteId})

                // Navigate to home page after deleting a palette
                navigate(`${routePrefix}/`)
              }}
            >
              Delete palette
            </Button>
          </VStack>
        </SidebarPanel>
        <Separator />
        <SidebarPanel title="Scales">
          <VStack spacing={8}>
            {Object.values(palette.scales).map(scale => (
              <Link
                key={scale.id}
                to={`scale/${scale.id}`}
                style={{
                  color: 'inherit',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                <VStack spacing={4}>
                  <span>{scale.name}</span>
                  <Box
                    sx={{
                      display: 'flex',
                      height: 24,
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    {scale.colors.map((_, index) => {
                      const color = getColor(palette.curves, scale, index)
                      return (
                        <div
                          key={index}
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: colorToHex(color)
                          }}
                        />
                      )
                    })}
                  </Box>
                </VStack>
              </Link>
            ))}
          </VStack>
          <Button style={{marginTop: 16, width: '100%'}} onClick={() => send({type: 'CREATE_SCALE', paletteId})}>
            New scale
          </Button>
        </SidebarPanel>
        <Separator />
        <SidebarPanel title="Curves">
          <VStack spacing={8}>
            {Object.values(palette.curves).map(curve => (
              <Link
                key={curve.id}
                to={`curve/${curve.id}`}
                style={{
                  color: 'inherit',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                <VStack spacing={4}>
                  <span>{curve.name}</span>
                  <div
                    style={{
                      display: 'flex',
                      height: 24,
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    {curve.values.map((value, index) => {
                      let color: Color

                      switch (curve.type) {
                        case 'hue':
                          color = {
                            hue: value,
                            saturation: 100,
                            lightness: 50
                          }
                          break

                        case 'saturation':
                          color = {
                            hue: 0,
                            saturation: 0,
                            lightness: 100 - value
                          }
                          break

                        case 'lightness':
                          color = {hue: 0, saturation: 0, lightness: value}
                          break
                      }

                      return (
                        <div
                          key={index}
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: colorToHex(color)
                          }}
                        />
                      )
                    })}
                  </div>
                </VStack>
              </Link>
            ))}
          </VStack>
        </SidebarPanel>
        <Separator />
        <SidebarPanel title="Naming schemes">
          <VStack spacing={8}>
            {Object.values(palette.namingSchemes).map(namingScheme => (
              <Link
                key={namingScheme.id}
                to={`naming-scheme/${namingScheme.id}`}
                style={{
                  color: 'inherit',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                <VStack spacing={4}>
                  <span>{namingScheme.name}</span>
                  <Box display="flex" alignItems="center" borderRadius={4} overflow="hidden" sx={{gap: 1}}>
                    {namingScheme.names.map(namingScheme => {
                      return (
                        <Box px={2} py={1} bg="var(--color-background-secondary)" fontSize={10}>
                          {namingScheme}
                        </Box>
                      )
                    })}
                  </Box>
                </VStack>
              </Link>
            ))}
          </VStack>
        </SidebarPanel>
      </div>
      <Main>{children}</Main>
    </Wrapper>
  )
}
