import "../src/styles/index.scss";
import "../src/styles/buttons.scss";
import React from 'react';

import Authenticated from "../components/Authenticated.js";

import useAuth, { AuthProvider } from "../contexts/authContext";

function App() {
  const {user, loading, error} = useAuth();
  
  return (
    <AuthProvider>
        <Authenticated />
    </AuthProvider>
  )
}

export default App;
