import * as React from 'react'
import {Box, Text} from '@primer/react'
import {RouteComponentProps} from '@reach/router'
import {HStack, VStack} from '../components/stack'
import {Textarea} from '../components/textarea'
import {useGlobalState} from '../global-state'
import {Button} from '../components/button'
import {Input} from '../components/input'

export function NamingScheme({
  paletteId = '',
  namingSchemeId = ''
}: React.PropsWithChildren<RouteComponentProps<{paletteId: string; namingSchemeId: string}>>) {
  const [state, send] = useGlobalState()
  const palette = state.context.palettes[paletteId]

  const namingScheme = palette.namingSchemes[namingSchemeId]

  const [name, setName] = React.useState(namingScheme.name)

  const [namingSchemeJSON, setNamingSchemeJSON] = React.useState(JSON.stringify(namingScheme.names, null, 2))

  function saveToneMap() {
    let newValue: any
    try {
      newValue = JSON.parse(namingSchemeJSON)
    } catch (error) {
      alert('Invalid JSON')
      return
    }

    setNamingSchemeJSON(JSON.stringify(newValue, null, 2))
    send('UPDATE_NAMING_SCHEME', {
      paletteId,
      namingScheme: {
        ...namingScheme,
        name: name,
        names: newValue
      }
    })
  }

  if (!namingScheme) {
    return (
      <div style={{padding: 16}}>
        <p style={{marginTop: 0}}>Scale not found</p>
      </div>
    )
  }

  return (
    <Box m={4}>
      <VStack spacing={16}>
        <Text as="h2" sx={{fontWeight: 'bold', fontSize: 4}}>
          {namingScheme.name}
        </Text>

        <VStack spacing={4}>
          <label htmlFor="namingSchemeName" style={{fontSize: 14}}>
            Naming scheme name
          </label>
          <Input onChange={event => setName(event.target.value)} placeholder={namingScheme.name} />
        </VStack>

        <VStack spacing={4}>
          <label htmlFor="namingSchemeName" style={{fontSize: 14}}>
            Naming scheme
          </label>
          <Textarea rows={30} value={namingSchemeJSON} onChange={event => setNamingSchemeJSON(event.target.value)} />
        </VStack>

        <HStack>
          <Button onClick={saveToneMap}>Save</Button>
        </HStack>
      </VStack>
    </Box>
  )
}
