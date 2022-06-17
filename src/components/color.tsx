import {Box} from '@primer/react'
import {toHsla, toRgba} from 'color2k'
import React from 'react'
import {useGlobalState} from '../global-state'
import {colorToHex, getColor} from '../utils'
import {Button} from './button'
import {Input} from './input'
import {SidebarPanel} from './sidebar-panel'
import {VStack} from './stack'

export function Color({paletteId = '', scaleId = '', index = ''}: {paletteId: string; scaleId: string; index: string}) {
  const [state, send] = useGlobalState()
  const palette = state.context.palettes[paletteId]
  const scale = palette.scales[scaleId]
  const indexAsNumber = parseInt(index, 10)
  const color = scale.colors[indexAsNumber]
  const colorName = palette.namingSchemes[scale.namingSchemeId || '']?.names?.[indexAsNumber]

  if (!color) {
    return null
  }

  const computedColor = getColor(palette.curves, scale, indexAsNumber)
  const hex = colorToHex(computedColor)

  return (
    <SidebarPanel title={`${scale.name}-${colorName || index}`}>
      <VStack spacing={16}>
        <Box sx={{width: '100%', height: 48, background: hex, borderRadius: 1}} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8
          }}
        >
          <VStack spacing={4}>
            <label htmlFor="hue" style={{fontSize: 14}}>
              {scale.curves.hue ? 'H offset' : 'H'}
            </label>
            <Input
              id="hue"
              type="number"
              style={{width: '100%'}}
              value={color.hue}
              min={0}
              max={360}
              onChange={event => {
                send({
                  type: 'CHANGE_COLOR_VALUE',
                  paletteId,
                  scaleId,
                  index: indexAsNumber,
                  value: {
                    hue: event.target.valueAsNumber || 0
                  }
                })
              }}
            />
          </VStack>
          <VStack spacing={4}>
            <label htmlFor="saturation" style={{fontSize: 14}}>
              {scale.curves.saturation ? 'S offset' : 'S'}
            </label>
            <Input
              id="saturation"
              type="number"
              style={{width: '100%'}}
              value={color.saturation}
              min={0}
              max={100}
              onChange={event => {
                send({
                  type: 'CHANGE_COLOR_VALUE',
                  paletteId,
                  scaleId,
                  index: indexAsNumber,
                  value: {
                    saturation: event.target.valueAsNumber || 0
                  }
                })
              }}
            />
          </VStack>
          <VStack spacing={4}>
            <label htmlFor="lightness" style={{fontSize: 14}}>
              {scale.curves.lightness ? 'L offset' : 'L'}
            </label>
            <Input
              id="lightness"
              type="number"
              style={{width: '100%'}}
              value={color.lightness}
              min={0}
              max={100}
              onChange={event => {
                send({
                  type: 'CHANGE_COLOR_VALUE',
                  paletteId,
                  scaleId,
                  index: indexAsNumber,
                  value: {
                    lightness: event.target.valueAsNumber || 0
                  }
                })
              }}
            />
          </VStack>
        </div>

        <Box as="code" sx={{fontFamily: 'mono', fontSize: 1}}>
          hsluv({computedColor.hue}, {computedColor.saturation}%, {computedColor.lightness}%)
        </Box>

        <Box as="code" sx={{fontFamily: 'mono', fontSize: 1}}>
          {hex}
        </Box>

        <Box as="code" sx={{fontFamily: 'mono', fontSize: 1}}>
          {toRgba(hex)}
        </Box>

        <Box as="code" sx={{fontFamily: 'mono', fontSize: 1}}>
          {toHsla(hex)}
        </Box>

        <Button
          disabled={scale.namingSchemeId != null || scale.namingSchemeId != null}
          onClick={() =>
            send({
              type: 'DELETE_COLOR',
              paletteId,
              scaleId,
              index: parseInt(index)
            })
          }
        >
          Delete color
        </Button>
      </VStack>
    </SidebarPanel>
  )
}
