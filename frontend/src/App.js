import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';

function App() {
  return (
      <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' exact element={<UserLogin/>}></Route>
          <Route path='/register' exact element={<UserRegister/>}></Route>
        </Routes>
      </div>
      </BrowserRouter>

  );
}

export default App;
