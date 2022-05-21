
import React from 'react';

import Authenticated from "../components/Authenticated";
import useAuth, { AuthProvider } from "../contexts/authContext";


function App() {
  const {user, loading, error} = useAuth();
  
  return (
    <Authenticated />
  )
}

export default App;
