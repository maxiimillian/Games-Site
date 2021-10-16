
import './App.css';
import Board from "./components/Board";
import React from 'react';
import { useState } from "react";


import Authenticated from "./components/Authenticated";
import Unauthenticated from './components/Unauthenticated';
import Loading from "./components/Loading";



async function attemptLogIn() {
  console.log("fetching...")
  const response = await fetch("http://localhost:3001", {
    method: "GET",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
    }
  })
  .then(data => {
    console.log("here3");
      let data_json = data.json();
      console.log(data_json)
      if (data_json["response"] == "success") {
        console.log("here");
        return true;
      } else {
        console.log("here2");
        return false;
      }
  })

  }


function App() {
  //True for now, eventually will be authtication check
  const [authenticated, setAuthenticated] = useState(true);
  console.log("Yppppppp")

  return (
  
    <React.Suspense fallback={<Loading/>}>
      {authenticated == true ? <Authenticated /> : <Unauthenticated handleLogin={attemptLogIn}/>}
    </React.Suspense>
  )
}

export default App;

