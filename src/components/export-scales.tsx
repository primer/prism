import {Button as PrimerButton, Textarea} from '@primer/react'
import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'
import copy from 'copy-to-clipboard'
import React from 'react'
import {Palette} from '../types'
import {getHexScales} from '../utils'
import {Button} from './button'
import {VStack} from './stack'

type ExportScalesProps = {
  palette: Palette
}

export function ExportScales({palette}: ExportScalesProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hexScales = React.useMemo(() => getHexScales(palette.curves, palette.scales), [palette.curves, palette.scales])

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
