import bezier from 'bezier-easing'
import {capitalize, kebabCase} from 'lodash'
import * as React from 'react'
import {easingFunctions, Easing} from '../easings'
import {Button} from './button'
import {Select} from './select'
import {SidebarPanel} from './sidebar-panel'
import {VStack} from './stack'

type CurveKey = keyof typeof easingFunctions

type ApplyEasingFunctionProps = {
  onApply: (easingFunction: bezier.EasingFunction) => void
}

export function ApplyEasingFunction({onApply}: ApplyEasingFunctionProps) {
  const [curveKey, setCurveKey] = React.useState<CurveKey>('linear')
  const baseCurve = easingFunctions[curveKey]
  const [easing, setEasing] = React.useState<Easing>('inOut')

  const easingOptions = typeof baseCurve === 'function' ? [] : Object.keys(baseCurve)
  const easingFunction = typeof baseCurve === 'function' ? baseCurve : baseCurve[easing]

  function applyEasingFunction() {
    onApply(easingFunction)
  }

  return (
    <SidebarPanel title="Apply easing function">
      <VStack spacing={16}>
        <VStack spacing={4}>
          <label htmlFor="base-curve" style={{fontSize: 14}}>
            Base curve
          </label>

          <Select id="base-curve" value={curveKey ?? ''} onChange={e => setCurveKey(e.target.value as CurveKey)}>
            {Object.keys(easingFunctions).map(key => (
              <option value={key} key={key}>
                {capitalize(key)}
              </option>
            ))}
          </Select>
        </VStack>

        <VStack spacing={4}>
          <label htmlFor="easing" style={{fontSize: 14}}>
            Easing
          </label>

          <Select
            id="easing"
            disabled={easingOptions.length === 0}
            value={easing ?? ''}
            onChange={e => setEasing(e.target.value as Easing)}
          >
            {easingOptions.length === 0 ? (
              <option>—</option>
            ) : (
              easingOptions.map(easing => (
                <option value={easing} key={easing}>
                  {capitalize(kebabCase(easing))}
                </option>
              ))
            )}
          </Select>
        </VStack>

        <Button onClick={applyEasingFunction} disabled={!easingFunction}>
          Apply easing
        </Button>
      </VStack>
    </SidebarPanel>
  )
}
