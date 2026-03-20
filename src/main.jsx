import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AddButtonProvider } from "./contexts/AddButtonContext.jsx";

createRoot(document.getElementById("root")).render(
  <AddButtonProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </AddButtonProvider>,
);
