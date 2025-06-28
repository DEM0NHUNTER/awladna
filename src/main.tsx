import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import App from "./App";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";

// Initialize AOS once
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});
const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No root element found. Is your index.html missing <div id='root'>?");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <App>
            <div id="root" style="border: 2px solid red;"></div>
          </App>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
