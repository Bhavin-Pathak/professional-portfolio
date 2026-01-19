import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme/theme-provider.js";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/app.js";
import reportWebVitals from "./utils/reportWebVitals";
import "./style/globals.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
reportWebVitals();
