import {Button as PrimerButton, Textarea} from '@primer/react'
import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'
import copy from 'copy-to-clipboard'
import {camelCase} from 'lodash-es'
import React from 'react'
import {Palette} from '../types'
import {colorToHex, getColor} from '../utils'
import {Button} from './button'
import {VStack} from './stack'

type ExportScalesProps = {
  palette: Palette
}

export function ExportScales({palette}: ExportScalesProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hexScales = React.useMemo(
    () =>
      Object.values(palette.scales).reduce<Record<string, string | string[]>>((acc, scale) => {
        let key = camelCase(scale.name)
        let i = 1

        while (key in acc) {
          i++
          key = `${camelCase(scale.name)}${i}`
        }

        const colors = scale.colors.map((_, index) => getColor(palette.curves, scale, index)).map(colorToHex)

        acc[key] = colors.length === 1 ? colors[0] : colors
        return acc
      }, {}),
    [palette.curves, palette.scales]
  )

  const code = React.useMemo(() => JSON.stringify(hexScales, null, 2), [hexScales])

  const svg = React.useMemo(() => generateSvg(hexScales), [hexScales])

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Export</Button>
      {isOpen ? (
        <Dialog title="Export" onClose={() => setIsOpen(false)}>
          <VStack spacing={16}>
            <Textarea
              aria-label="Copy JSON"
              rows={16}
              value={code}
              readOnly
              resize="vertical"
              sx={{fontFamily: 'mono'}}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16
              }}
            >
              <PrimerButton onClick={() => copy(code)}>Copy JSON</PrimerButton>
              <PrimerButton onClick={() => copy(svg)}>Copy SVG</PrimerButton>
            </div>
          </VStack>
        </Dialog>
      ) : null}
    </>
  )
}

function generateSvg(scales: Record<string, string | string[]>) {
  const rectWidth = 200
  const rectHeight = 50

  const width = Object.values(scales).length * rectWidth
  const height =
    Object.values(scales).reduce((acc, colors) => {
      const colorsArray = Array.isArray(colors) ? colors : [colors]
      return Math.max(colorsArray.length, acc)
    }, 0) * rectHeight

  return `<svg viewBox="0 0 ${width} ${height}">
  ${Object.entries(scales).map(([key, colors], index) => {
    const colorsArray = Array.isArray(colors) ? colors : [colors]
    return `<g id="${key}">
    ${colorsArray
      .map((color, i) => {
        const x = index * rectWidth
        const y = i * rectHeight
        return `<rect x="${x}" y="${y}" width="${rectWidth}" height="${rectHeight}" fill="${color}"/>`
      })
      .join('')}
  </g>`
  })}
</svg>`
}
