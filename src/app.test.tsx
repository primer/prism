import { render } from "@testing-library/react";
import React from "react";
import { App } from "./app";

test("renders without crashing", () => {
  render(<App />);
});
