import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux/Store.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <ThemeProvider>
      <ToastContainer autoClose={2000} />
      <Provider store={store}>
      <App />
      </Provider>
    </ThemeProvider>
  /* </StrictMode> */
);
