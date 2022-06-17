import {CheckCircleFillIcon, DashIcon, PlusIcon, XCircleIcon} from '@primer/octicons-react'
import {Box, ButtonGroup, Text} from '@primer/react'
import {Link, navigate, RouteComponentProps} from '@reach/router'
import {getContrast} from 'color2k'
import React from 'react'
import {Button, IconButton} from '../components/button'
import {Color} from '../components/color'
import {CurveEditor} from '../components/curve-editor'
import {Input} from '../components/input'
import {Select} from '../components/select'
import {Separator} from '../components/separator'
import {SidebarPanel} from '../components/sidebar-panel'
import {VStack, ZStack} from '../components/stack'
import {routePrefix} from '../constants'
import {useGlobalState} from '../global-state'
import {Curve} from '../types'
import {colorToHex, getColor, getContrastScore, getRange} from '../utils'

export function Scale({
  paletteId = '',
  scaleId = ''
}: React.PropsWithChildren<RouteComponentProps<{paletteId: string; scaleId: string}>>) {
  const [selectedIndex, setIndex] = React.useState('0')
  const [state, send] = useGlobalState()
  const palette = state.context.palettes[paletteId]
  const scale = palette.scales[scaleId]
  // TODO: allow resizing
  const [visibleCurves, setVisibleCurves] = React.useState({
    hue: true,
    saturation: true,
    lightness: true
  })

  if (!scale) {
    return (
      <div style={{padding: 16}}>
        <p style={{marginTop: 0}}>Scale not found</p>
      </div>
    )
  }

  let focusedHex: string | undefined
  const index = String(Math.min(Number(selectedIndex), scale.colors.length - 1))

  const name = palette.namingSchemes[scale.namingSchemeId || '']?.names?.[+index]
  const colorName = `${scale.name}-${name || index}`

  try {
    const focusedColor = index ? getColor(palette.curves, scale, parseInt(index, 10)) : undefined
    focusedHex = focusedColor ? colorToHex(focusedColor) : undefined
  } catch (error) {}

  return (
    <div
      style={{
        display: 'flex',
        height: '100%'
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gap: 16,
          padding: 16,
          height: '100%'
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <ButtonGroup>
            {Object.entries(visibleCurves).map(([type, isVisible]) => {
              return (
                <Button
                  key={type}
                  aria-label={`Toggle ${type} curve visibility`}
                  aria-pressed={isVisible}
                  onClick={() => setVisibleCurves({...visibleCurves, [type]: !isVisible})}
                  style={{
                    background: isVisible ? 'var(--color-background-secondary)' : 'var(--color-background)'
                  }}
                >
                  {type[0].toUpperCase()}
                </Button>
              )
            })}
          </ButtonGroup>
          <ButtonGroup>
            <IconButton
              icon={DashIcon}
              aria-label="Remove color from end of scale"
              onClick={() => send({type: 'POP_COLOR', paletteId, scaleId})}
              disabled={scale.namingSchemeId != null || scale.colors.length === 1}
            />
            <IconButton
              icon={PlusIcon}
              aria-label="Add color to end of scale"
              onClick={() => send({type: 'CREATE_COLOR', paletteId, scaleId})}
              disabled={scale.namingSchemeId != null}
            />
          </ButtonGroup>
        </Box>
        <ZStack>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: '100%',
              borderRadius: 2
            }}
          >
            {scale.colors.map((_, i) => {
              const color = getColor(palette.curves, scale, i)
              const hex = colorToHex(color)
              const contrast = focusedHex ? getContrast(hex, focusedHex) : undefined
              const contrastScore = contrast ? getContrastScore(contrast) : undefined
              return (
                <Box
                  key={i}
                  tabIndex={0}
                  onFocus={() => setIndex(String(i))}
                  sx={{
                    outline: 'none',
                    width: '100%',
                    height: '100%',
                    color: focusedHex,
                    backgroundColor: hex,
                    borderTopLeftRadius: i === 0 ? 2 : 0,
                    borderBottomLeftRadius: i === 0 ? 2 : 0,
                    borderTopRightRadius: i === scale.colors.length - 1 ? 2 : 0,
                    borderBottomRightRadius: i === scale.colors.length - 1 ? 2 : 0,
                    position: 'relative',
                    fontSize: 1,
                    display: 'grid',
                    placeItems: 'end center',
                    p: 2,
                    fontWeight: 'bold',
                    '&::before': {
                      content: '""',
                      display: String(i) === index ? 'block' : 'none',
                      position: 'absolute',
                      top: '-8px',
                      height: 4,
                      left: 0,
                      right: 0,
                      backgroundColor: 'var(--color-text)',
                      borderRadius: 2
                    }
                  }}
                  onClick={() => setIndex(String(i))}
                >
                  <Box display="flex" alignItems="center" flexDirection="column">
                    <span
                      style={{
                        transform: 'rotate(180deg)',
                        textOrientation: 'sideways',
                        writingMode: 'vertical-lr',
                        whiteSpace: 'nowrap',
                        textAlign: 'right',
                        marginInlineEnd: 5
                      }}
                    >
                      {contrastScore}{' '}
                    </span>
                    {contrastScore === 'Fail' ? <XCircleIcon /> : <CheckCircleFillIcon />}
                  </Box>
                </Box>
              )
            })}
          </Box>
          {(Object.entries(scale.curves) as [Curve['type'], string | undefined][])
            .filter(([type]) => visibleCurves[type])
            .map(([type, curveId]) => {
              if (!curveId) return null

              return (
                <CurveEditor
                  key={curveId}
                  values={palette.curves[curveId].values}
                  {...getRange(type)}
                  disabled
                  label={`${type[0].toUpperCase()}`}
                />
              )
            })}
          {(['hue', 'saturation', 'lightness'] as const)
            .filter(type => visibleCurves[type])
            .map(type => {
              return (
                <CurveEditor
                  key={type}
                  values={scale.colors.map((color, index) => getColor(palette.curves, scale, index)[type])}
                  {...getRange(type)}
                  label={`${type[0].toUpperCase()}`}
                  onFocus={index => setIndex(String(index))}
                  onChange={(values, shiftKey, index) => {
                    if (shiftKey && scale.curves[type]) {
                      send({
                        type: 'CHANGE_CURVE_VALUES',
                        paletteId,
                        curveId: scale.curves[type] ?? '',
                        values: values.map((value, index) => value - scale.colors[index][type])
                      })
                    } else {
                      send({
                        type: 'CHANGE_SCALE_COLORS',
                        paletteId,
                        scaleId,
                        colors: scale.colors.map((color, index) => ({
                          ...color,
                          [type]: values[index] - (palette.curves[scale.curves[type] ?? '']?.values[index] ?? 0)
                        }))
                      })
                    }
                  }}
                />
              )
            })}
        </ZStack>
        {index ? (
          <div style={{flexShrink: 0, display: 'flex', height: 48}}>
            {Object.values(palette.scales)
              .filter(scale => scale.colors.length > parseInt(index))
              .map((currentScale, i) => {
                const numScales = Object.values(palette.scales).filter(
                  scale => scale.colors.length > parseInt(index)
                ).length
                return (
                  <Box
                    key={i}
                    as={Link}
                    aria-label={`Go to ${currentScale.name} scale`}
                    to={`${routePrefix}/local/${paletteId}/scale/${currentScale.id}`}
                    replace={true}
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: colorToHex(getColor(palette.curves, currentScale, parseInt(index))),
                      borderTopLeftRadius: i === 0 ? 2 : 0,
                      borderBottomLeftRadius: i === 0 ? 2 : 0,
                      borderTopRightRadius: i === numScales - 1 ? 2 : 0,
                      borderBottomRightRadius: i === numScales - 1 ? 2 : 0,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        display: scale.id === currentScale.id ? 'block' : 'none',
                        position: 'absolute',
                        top: '-8px',
                        height: 4,
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--color-text)',
                        borderRadius: 2
                      }
                    }}
                  />
                )
              })}
          </div>
        ) : null}
      </div>
      <VStack
        style={{
          borderLeft: '1px solid var(--color-border, gainsboro)',
          width: 300,
          flexShrink: 0,
          overflow: 'auto',
          paddingBottom: 16
        }}
      >
        <SidebarPanel title="Scale">
          <VStack spacing={16}>
            <VStack spacing={4}>
              <label htmlFor="name" style={{fontSize: 14}}>
                Name
              </label>
              <Input
                type="text"
                aria-label="Scale name"
                value={scale.name}
                onChange={event =>
                  send({
                    type: 'CHANGE_SCALE_NAME',
                    paletteId,
                    scaleId,
                    name: event.target.value
                  })
                }
              />
            </VStack>
            <Button
              onClick={() => {
                send({type: 'DELETE_SCALE', paletteId, scaleId})
                navigate(`${routePrefix}/local/${paletteId}`)
              }}
            >
              Delete scale
            </Button>
          </VStack>
        </SidebarPanel>
        <Separator />
        <SidebarPanel title="Linked naming scheme">
          <VStack spacing={4}>
            <label htmlFor="hue-curve" style={{fontSize: 14}}>
              Naming scheme
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 8
              }}
            >
              <Select
                key={`${scale.name}-naming-scheme`}
                id="naming-scheme"
                value={scale.namingSchemeId ?? ''}
                onChange={event => {
                  send({
                    type: 'CHANGE_SCALE_NAMING_SCHEME',
                    paletteId,
                    scaleId,
                    namingSchemeId: event.target.value || null
                  })
                }}
              >
                <option value="">None</option>
                {Object.values(palette.namingSchemes).map(namingScheme => (
                  <option key={namingScheme.id} value={namingScheme.id}>
                    {namingScheme.name}
                  </option>
                ))}
              </Select>
              <IconButton
                aria-label="Create naming scheme"
                icon={PlusIcon}
                onClick={() =>
                  send({
                    type: 'CREATE_NAMING_SCHEME_FROM_SCALE',
                    paletteId,
                    scaleId
                  })
                }
              />
            </div>
          </VStack>
        </SidebarPanel>
        <Separator />
        <SidebarPanel title="Linked curves">
          <VStack spacing={16}>
            <VStack spacing={4}>
              <label htmlFor="hue-curve" style={{fontSize: 14}}>
                Hue curve
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 8
                }}
              >
                <Select
                  key={`${scale.name}-hue-curve`}
                  id="hue-curve"
                  value={scale.curves.hue}
                  onChange={event =>
                    send({
                      type: 'CHANGE_SCALE_CURVE',
                      paletteId,
                      scaleId,
                      curveType: 'hue',
                      curveId: event.target.value
                    })
                  }
                >
                  <option value="">None</option>
                  {Object.values(palette.curves)
                    .filter(curve => curve.type === 'hue')
                    .map(curve => (
                      <option key={curve.id} value={curve.id}>
                        {curve.name}
                      </option>
                    ))}
                </Select>
                <IconButton
                  aria-label="Create hue curve"
                  icon={PlusIcon}
                  onClick={() =>
                    send({
                      type: 'CREATE_CURVE_FROM_SCALE',
                      paletteId,
                      scaleId,
                      curveType: 'hue'
                    })
                  }
                />
              </div>
            </VStack>
            <VStack spacing={4}>
              <label htmlFor="saturation-curve" style={{fontSize: 14}}>
                Saturation curve
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 8
                }}
              >
                <Select
                  key={`${scale.name}-saturation-curve`}
                  id="saturation-curve"
                  value={scale.curves.saturation}
                  onChange={event =>
                    send({
                      type: 'CHANGE_SCALE_CURVE',
                      paletteId,
                      scaleId,
                      curveType: 'saturation',
                      curveId: event.target.value
                    })
                  }
                >
                  <option value="">None</option>
                  {Object.values(palette.curves)
                    .filter(curve => curve.type === 'saturation')
                    .map(curve => (
                      <option key={curve.id} value={curve.id}>
                        {curve.name}
                      </option>
                    ))}
                </Select>
                <IconButton
                  icon={PlusIcon}
                  aria-label="Create saturation curve"
                  onClick={() =>
                    send({
                      type: 'CREATE_CURVE_FROM_SCALE',
                      paletteId,
                      scaleId,
                      curveType: 'saturation'
                    })
                  }
                />
              </div>
            </VStack>
            <VStack spacing={4}>
              <label htmlFor="lightness-curve" style={{fontSize: 14}}>
                Lightness curve
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 8
                }}
              >
                <Select
                  key={`${scale.name}-lightness-curve`}
                  id="lightness-curve"
                  value={scale.curves.lightness}
                  onChange={event =>
                    send({
                      type: 'CHANGE_SCALE_CURVE',
                      paletteId,
                      scaleId,
                      curveType: 'lightness',
                      curveId: event.target.value
                    })
                  }
                >
                  <option value="">None</option>
                  {Object.values(palette.curves)
                    .filter(curve => curve.type === 'lightness')
                    .map(curve => (
                      <option key={curve.id} value={curve.id}>
                        {curve.name}
                      </option>
                    ))}
                </Select>
                <IconButton
                  aria-label="Create lightness curve"
                  icon={PlusIcon}
                  onClick={() =>
                    send({
                      type: 'CREATE_CURVE_FROM_SCALE',
                      paletteId,
                      scaleId,
                      curveType: 'lightness'
                    })
                  }
                />
              </div>
            </VStack>
          </VStack>
        </SidebarPanel>
        {index ? (
          <>
            <Separator />
            <Color paletteId={paletteId} scaleId={scaleId} index={index} />
            <Separator />
            {/* TODO: Pull this into a separate component */}
            <SidebarPanel title={`Contrast of ${colorName}`}>
              <Box
                as="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gap: 2,
                  fontSize: 1
                }}
              >
                {[
                  {
                    name: 'bg',
                    hex: palette.backgroundColor,
                    contrast: getContrast(palette.backgroundColor, focusedHex || '')
                  },
                  ...scale.colors
                    .map((_, i) => {
                      const hex = colorToHex(getColor(palette.curves, scale, i))
                      const contrast = getContrast(hex, focusedHex || '')
                      const name = palette.namingSchemes[scale.namingSchemeId || '']?.names[i]
                      return {
                        name: `${scale.name}-${name || i}`,
                        hex,
                        contrast
                      }
                    })
                    .filter((_, i) => i !== Number(index))
                ].map(({name, hex, contrast}) => (
                  <Box
                    key={name}
                    as="li"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      justifyContent: 'space-between'
                    }}
                  >
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                      <Box
                        aria-hidden
                        sx={{
                          color: focusedHex,
                          bg: hex,
                          border: '1px solid',
                          borderColor: 'var(--color-border)',
                          width: 32,
                          height: 32,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: 2
                        }}
                      >
                        Aa
                      </Box>
                      <span>on {name}</span>
                    </Box>
                    <span>
                      <Text sx={{mr: 2}}>{contrast.toFixed(2)}</Text>
                      <Text sx={{fontWeight: 'bold'}}>
                        {getContrastScore(getContrast(hex, focusedHex || ''))}{' '}
                        {getContrastScore(getContrast(hex, focusedHex || '')) === 'Fail' ? (
                          <XCircleIcon />
                        ) : (
                          <CheckCircleFillIcon />
                        )}
                      </Text>
                    </span>
                  </Box>
                ))}
              </Box>
            </SidebarPanel>
          </>
        ) : null}
      </VStack>
    </div>
  )
}
