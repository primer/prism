import {BaseStyles, themeGet} from '@primer/react'
import {Router} from '@reach/router'
import {useHotkeys} from 'react-hotkeys-hook'
import {createGlobalStyle} from 'styled-components'
import {routePrefix} from './constants'
import {useGlobalState} from './global-state'
import {Index} from './pages'
import {Curve} from './pages/curve'
import {NamingScheme} from './pages/naming-scheme'
import {NotFound} from './pages/not-found'
import {Palette} from './pages/palette'
import {Scale} from './pages/scale'

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${themeGet('colors.canvas.default')};
  }
`

export function App() {
  const [, send] = useGlobalState()

  useHotkeys('command+z, ctrl+z', () => send('UNDO'))
  useHotkeys('command+shift+z, ctrl+shift+z', () => send('REDO'))

  return (
    <BaseStyles>
      <GlobalStyles />
      <Router>
        <Index path={`${routePrefix}/`} />
        <Palette path={`${routePrefix}/local/:paletteId`}>
          <Scale path="scale/:scaleId"></Scale>
          <Curve path="curve/:curveId"></Curve>
          <NamingScheme path="naming-scheme/:namingSchemeId"></NamingScheme>
        </Palette>
        <NotFound default />
      </Router>
    </BaseStyles>
  )
}
