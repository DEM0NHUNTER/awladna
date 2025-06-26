// src/main.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import AOS from "aos";
import "aos/dist/aos.css";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AOSWrapper>
          <App />
        </AOSWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

function AOSWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({ once: true, duration: 800, easing: "ease-in-out" });
  }, []);
  return <>{children}</>;
}
