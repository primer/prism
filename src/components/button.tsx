import styled from "styled-components";

export const Button = styled.button<{ variant?: "danger" }>`
  height: 32px;
  padding: 0 16px;
  font-family: inherit;
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
  background-color: gainsboro;
  border: 1px solid darkgray;
  border-radius: 3px;
  appearance: none;

  &:active {
    background-color: darkgray;
  }

  ${props => {
    switch (props.variant) {
      case "danger":
        return {
          color: "firebrick",
          borderColor: "firebrick",
        };
    }
  }}
`;
