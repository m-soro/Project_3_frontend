import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CreateData from "./pages/CreateData";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import { useGetUserID } from "./hooks/useGetUserID";
import MyListContext from "./contexts/MyListContext";

function App() {
  const userID = useGetUserID();

  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-data" element={<CreateData />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
