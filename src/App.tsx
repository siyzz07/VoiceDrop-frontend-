import { BrowserRouter } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const{ isDarkMode } = useTheme() ;
  return (
    <BrowserRouter>
    <ToastContainer
      position="top-center"
      autoClose={2500}
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      theme={isDarkMode?'colored':'light'}
      // transition={Bounce}
      limit={3}
    />
      <UserRoutes />
    </BrowserRouter>
  );
};

export default App;
