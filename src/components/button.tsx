import styled from "styled-components";

export const Button = styled.button`
  height: 32px;
  padding: 0 8px;
  margin: 0;
  font-family: inherit;
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
  color: var(--color-text);
  background-color: var(--color-background-secondary, gainsboro);
  border: 1px solid var(--color-border, darkgray);
  border-radius: 3px;
  appearance: none;

  &:active {
    background-color: var(--color-border, darkgray);
  }
`;
