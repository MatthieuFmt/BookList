import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import ResetPassword from "./components/RegistrationConnection/ResetPassword";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
