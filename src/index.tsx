import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ClerkProvider } from "@clerk/clerk-react";
import { esES } from "@clerk/localizations";

if (!process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY}
      localization={esES}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
