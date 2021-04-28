import { render } from "@testing-library/react";
import React from "react";
import App from "./App";

test("renders without crashing", () => {
  render(<App />);
});
