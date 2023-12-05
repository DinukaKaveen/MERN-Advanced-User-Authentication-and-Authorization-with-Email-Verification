import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import Dashboard from "./pages/Dashboard";
import UserVerify from "./pages/UserVerify";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" exact element={<UserLogin />}></Route>
          <Route path="/dashboard" exact element={<Dashboard />}></Route>
          <Route path="/register" exact element={<UserRegister />}></Route>
          <Route path="/:id/verify/:token" exact element={<UserVerify />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
