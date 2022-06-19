import {Button as PrimerButton, Flash, Textarea} from '@primer/react'
import {Dialog} from '@primer/react/lib-esm/Dialog/Dialog'
import {isArray, keyBy} from 'lodash-es'
import React from 'react'
import {v4 as uniqueId} from 'uuid'
import {Scale} from '../types'
import {hexToColor} from '../utils'
import {Button} from './button'
import {HStack, VStack} from './stack'

const PLACEHOLDER = `{
  "gray": [
    "#eee",
    "#ddd",
    "#ccc"
  ]
}`

type ImportScalesProps = {
  onImport: (scales: Record<string, Scale>, replace: boolean) => void
}

export function ImportScales({onImport}: ImportScalesProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [replace, setReplace] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const parsedCode: Record<string, string | string[]> = JSON.parse(code)

      const scales: Scale[] = Object.entries(parsedCode).map(([name, scale]) => {
        const id = uniqueId()
        const scaleArray = isArray(scale) ? scale : [scale]
        return {id, name, colors: scaleArray.map(hexToColor), curves: {}}
      })

      onImport(keyBy(scales, 'id'), replace)

      // Reset state
      setIsOpen(false)
      setCode('')
      setError('')
      setReplace(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Import</Button>
      {isOpen ? (
        <Dialog title="Import" onClose={() => setIsOpen(false)}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={16}>
              {error ? <Flash variant="danger">{error}</Flash> : null}
              <VStack spacing={4}>
                <label htmlFor="code" style={{fontSize: 14}}>
                  Paste JSON
                </label>
                <Textarea
                  id="code"
                  rows={12}
                  sx={{fontFamily: 'mono'}}
                  placeholder={PLACEHOLDER}
                  value={code}
                  onChange={event => setCode(event.target.value)}
                />
              </VStack>
              <HStack spacing={4}>
                <input
                  type="checkbox"
                  id="replace"
                  checked={replace}
                  onChange={event => setReplace(event.target.checked)}
                />
                <label htmlFor="replace" style={{fontSize: 14, lineHeight: 1}}>
                  Replace existing scales
                </label>
              </HStack>
              <PrimerButton>Import</PrimerButton>
            </VStack>
          </form>
        </Dialog>
      ) : null}
    </>
  )
}
