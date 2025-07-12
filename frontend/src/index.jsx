import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserContext from "context/UserContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
<UserContext>
 <App />
</UserContext>
    
</GoogleOAuthProvider>
);
