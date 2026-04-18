import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EmergencyScreen from "./pages/EmergencyScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/emergency" element={<EmergencyScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;