
import './App.css';
import React from 'react';
import { useState } from "react";


import Authenticated from "./components/Authenticated";

import useAuth, { AuthProvider } from "./contexts/authContext";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  //True for now, eventually will be authtication check
  const {user, loading, error} = useAuth();
  
  return (
    <Router>
      <AuthProvider>
        <Authenticated />
      </AuthProvider>
    </Router>
  )
}

export default App;

