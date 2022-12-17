import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pageModules/Dashboard/Dashboard";
import LoginBg from "./components/pageModules/LoginPage/LoginBg";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route >
          <Route path="/" element={<LoginBg />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
