import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import CreateTask from './pages/CreateTask';
import UpdateTask from './pages/UpdateTask';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import UserVerify from './pages/UserVerify';

function App() {
  return (
      <BrowserRouter>
      <div>
        <Routes>
          <Route path='/tasks' exact element={<Home/>}></Route>
          <Route path='/' exact element={<UserLogin/>}></Route>
          <Route path='/register' exact element={<UserRegister/>}></Route>
          <Route path='/:id/verify/:token' exact element={<UserVerify/>}></Route>
          <Route path='/create_task' exact element={<CreateTask/>}></Route>
          <Route path='/update_task/:id' exact element={<UpdateTask/>}></Route>
        </Routes>
      </div>
      </BrowserRouter>

  );
}

export default App;
