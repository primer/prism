import { Link, RouteComponentProps } from "@reach/router";
import React from "react";
import {routePrefix} from "../constants"

export function NotFound(props: RouteComponentProps) {
  

  return (
    <div style={{ padding: 16 }}>
      <p style={{ marginTop: 0 }}>Page not found</p>
      <Link to={`${routePrefix}/`}>Go home</Link>
    </div>
  );
}
