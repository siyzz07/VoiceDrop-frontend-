import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <UserRoutes />
    </BrowserRouter>
  );
};

export default App;
