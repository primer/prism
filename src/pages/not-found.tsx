import { Link, RouteComponentProps } from "@reach/router";
import React from "react";

export function NotFound(props: RouteComponentProps) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ marginTop: 0 }}>Page not found</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
