import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme/theme-provider.js";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/app.js";
import reportWebVitals from "./utils/reportWebVitals";
import "./style/globals.css";

if (process.env.NODE_ENV === "production") {
  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Disable common developer shortcut keys
  document.addEventListener("keydown", (e) => {
    // Disable F12
    if (e.keyCode === 123) {
      e.preventDefault();
    }
    // Disable Ctrl+Shift+I / Cmd+Option+I (inspect)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
      e.preventDefault();
    }
    // Disable Ctrl+Shift+J / Cmd+Option+J (console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
      e.preventDefault();
    }
    // Disable Ctrl+Shift+C / Cmd+Option+C (element selector)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
      e.preventDefault();
    }
    // Disable Ctrl+U / Cmd+Option+U (view source)
    if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
      e.preventDefault();
    }
  });
}

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
