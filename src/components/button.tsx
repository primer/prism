import {Button as PrimerButton, IconButton as PrimerIconButton} from '@primer/react'
import styled from 'styled-components'

export const Button = styled(PrimerButton)`
  color: var(--color-text);
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  box-shadow: none;
  margin: 0;

  &:not([disabled]):hover,
  &:not([disabled]):active {
    background-color: var(--color-background-secondary-hover);
    border-color: var(--color-border);
  }

  &[disabled] {
    color: var(--color-text);
    opacity: 0.5;
  }
`

export const IconButton = styled(PrimerIconButton)`
  color: var(--color-text);
  background-color: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  box-shadow: none;
  margin: 0;

  &:not([disabled]):hover {
    background-color: var(--color-background-secondary-hover);
  }

  &[disabled] {
    color: var(--color-text);
    opacity: 0.5;
  }
`
