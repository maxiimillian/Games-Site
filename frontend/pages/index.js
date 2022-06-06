
import React from 'react';

import Authenticated from "../components/Authenticated";
import Icon from "../components/common/Icon";
import useAuth, { AuthProvider } from "../contexts/authContext";

import Home from "../components/main/Home";


function App() {
  const {user, loading, error} = useAuth();
  
  return (
    <div className="page-container">
      <div className="left-container">
        <Icon />
      </div>
      <div className="center-container">
          {/* maybe put the Sign in/ username above the centr control thing */}
          <h1 className="site-title">Playholdr</h1>
          <Home />
      </div>
      <div className="right-container">
          
      </div>
    </div>
  )
}

export default App;
