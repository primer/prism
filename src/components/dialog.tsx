import * as Dialog from "@radix-ui/react-dialog";
import styled from "styled-components";

export { Root, Trigger, Close } from "@radix-ui/react-dialog";

export const Overlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
  min-width: 400px;
  max-width: fit-content;
  max-height: 85vh;
  margin-top: -5vh;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  overflow: auto;
`;
