import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx"; 
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AppProvider } from "./context/AppContext.tsx";
import { Toaster } from "react-hot-toast";

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <BrowserRouter>
    <ThemeProvider>
      <AppProvider>
        <Toaster />
        <App />
      </AppProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
