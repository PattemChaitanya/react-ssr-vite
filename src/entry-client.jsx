import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { Provider } from "react-redux";
import CreateRoutes from "./Routes";

const preloadedState = window.__PRELOADED_STATE__;

ReactDOM.hydrateRoot(
  document.getElementById("root"),
  <React.StrictMode>
    <Provider store={store} serverState={preloadedState}>
      <BrowserRouter>
        <CreateRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

