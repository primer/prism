import bezier from 'bezier-easing'
import * as React from 'react'
import {curves} from '../curves'
import {Button} from './button'
import {Select} from './select'
import {SidebarPanel} from './sidebar-panel'
import {VStack} from './stack'

type CurveKey = keyof typeof curves

type ApplyEasingFunctionProps = {
  onApply: (easingFunction: bezier.EasingFunction) => void
}

export function ApplyEasingFunction({onApply}: ApplyEasingFunctionProps) {
  const [curveKey, setCurveKey] = React.useState<CurveKey | null>(null)

  function applyCurve() {
    if (!curveKey) return
    const easingFunction = curves[curveKey]
    onApply(easingFunction)
  }

  return (
    <SidebarPanel title="Apply easing function">
      <VStack spacing={16}>
        <Select value={curveKey ?? ''} onChange={e => setCurveKey(e.target.value as CurveKey)}>
          <option value="" defaultChecked>
            Select an easing function
          </option>

          <option disabled>—</option>

          {Object.keys(curves).map(key => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </Select>

        <Button onClick={applyCurve}>Apply {curveKey}</Button>
      </VStack>
    </SidebarPanel>
  )
}
