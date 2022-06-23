import {Box} from '@primer/react'
import * as React from 'react'
import {useGlobalState} from '../global-state'
import {getHexScales} from '../utils'
import {generateStyleDictionaryTokens} from './export-scales'

export function DiscordPreview() {
  const [state] = useGlobalState()
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const hexScales = React.useMemo(() => {
    const palette = Object.values(state.context.palettes).find(palette =>
      palette.name.toLowerCase().includes('discord')
    )
    if (!palette) return null
    return getHexScales(palette)
  }, [state])

  React.useEffect(() => {
    if (!hexScales) return
    const styleDictionaryTokens = generateStyleDictionaryTokens(hexScales)

    const timeout = setTimeout(() => {
      if (!iframeRef.current) return
      iframeRef.current.contentWindow?.postMessage(styleDictionaryTokens, '*')
    }, 500)

    return () => clearTimeout(timeout)
  }, [hexScales])

  return (
    <Box
      as="iframe"
      ref={iframeRef}
      width={1}
      height="100%"
      src="http://localhost:3333"
      allow="*"
      sandbox=""
      title="Discord"
      border="0"
    />
  )
}
