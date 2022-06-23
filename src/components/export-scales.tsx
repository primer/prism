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
  const hexScales = React.useMemo(() => getHexScales(palette), [palette])

  const code = React.useMemo(() => JSON.stringify(hexScales, null, 2), [hexScales])

  const svg = React.useMemo(() => generateSvg(hexScales), [hexScales])

  const figmaTokens = React.useMemo(() => JSON.stringify(generateFigmaTokens(hexScales), null, 2), [hexScales])

  const styleDictionaryTokens = React.useMemo(
    () => JSON.stringify(generateStyleDictionaryTokens(hexScales), null, 2),
    [hexScales]
  )

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
              <PrimerButton onClick={() => copy(figmaTokens)}>Copy Figma Tokens</PrimerButton>
              <PrimerButton onClick={() => copy(styleDictionaryTokens)}>Copy Style Dictionary Tokens</PrimerButton>
            </div>
          </VStack>
        </Dialog>
      ) : null}
    </>
  )
}

function generateSvg(scales: Record<string, string | {[name: string]: string}>) {
  const rectWidth = 200
  const rectHeight = 50

  const width = Object.values(scales).length * rectWidth
  const height =
    Object.values(scales).reduce((acc, colors) => {
      const colorsArray = typeof colors === 'string' ? [colors] : Object.values(colors)
      return Math.max(colorsArray.length, acc)
    }, 0) * rectHeight

  return `<svg viewBox="0 0 ${width} ${height}">
  ${Object.entries(scales).map(([key, colors], index) => {
    const colorsArray = typeof colors === 'string' ? [colors] : Object.values(colors)
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

function generateFigmaTokens(scales: Record<string, string | {[name: string]: string}>) {
  return Object.fromEntries(
    Object.entries(scales).map(([key, colors]) => {
      const colorsArray = typeof colors === 'string' ? [colors] : Object.values(colors)
      const colorsObject = Object.fromEntries(
        colorsArray.map((color, i) => {
          return [i, {value: color, type: 'color'}]
        })
      )
      return [key, colorsObject]
    })
  )
}

export function generateStyleDictionaryTokens(scales: Record<string, string | {[name: string]: string}>) {
  const result: any = {}

  for (const [scaleName, scale] of Object.entries(scales)) {
    const kebabScaleName = scaleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

    result[kebabScaleName] = {}

    if (typeof scale === 'string') {
      result[kebabScaleName] = {value: scale}
    } else {
      for (const [colorName, color] of Object.entries(scale)) {
        result[kebabScaleName][colorName] = {value: color}
      }
    }
  }

  return result
}
