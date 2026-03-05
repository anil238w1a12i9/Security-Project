import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="402858537921-eq94mengq8ia7vf5lskcn8mqbnv242t8.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);