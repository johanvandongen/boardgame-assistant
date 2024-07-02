import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ThemeContext from "./ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeContext />
    </React.StrictMode>
);
