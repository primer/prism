import styled from "styled-components";

// TODO: add alignment prop

export const HStack = styled.div<{ spacing?: number | string }>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: ${props => px(props.spacing)};
  align-items: center;
`;

export const VStack = styled.div<{ spacing?: number | string }>`
  display: grid;
  grid-auto-flow: row;
  grid-auto-columns: max-content;
  gap: ${props => px(props.spacing)};
  align-items: center;
`;

export const ZStack = styled.div`
  display: grid;
  place-items: center;

  & > * {
    grid-area: 1 / 1;
  }
`;

export function px(value: any) {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
}
