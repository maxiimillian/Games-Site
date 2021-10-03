


import { useCallback, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    Redirect,
  } from "react-router-dom";

import Home from "./Home";
import Board from "./Board";
import Table from "./Table";
import CenterControl from "./CenterControl";
import Chatbox from "./Chatbox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import logo from '../public/logo.png';
import wenis_profile from '../public/wenis.jpg';
import other_profile from "../public/bingo.jpg";
import Unauthenticated from './Unauthenticated';


//<Board board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"} board_json={JSON.parse(data)}/>
// Change this to a router for home, sudoku, and poker. When you go to /sudoku/:gameid it attempts to join with that game code. If its the host then show a waiting screen, if it
// errors show errors, if its open then put into waiting screen and change on the start call
// I think just getting the token here is fine and no need to get token elsewhere but will do that after.

function Authenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function handleFormSubmit() {
        setIsAuthenticated(true);
    }

    async function getToken() {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token: localStorage.getItem("token")}),
        })
        .then(data => {
            return data.json();
        })
        .then((resp) => {
            if (resp.success) {
                localStorage.setItem("token", resp.token);
            } else {
                localStorage.setItem("token", "nope");
            }
        } )
    };

    useEffect(() => getToken(), []);

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <Unauthenticated handleSubmit={handleFormSubmit}/>
                    {isAuthenticated ? <Redirect to="/" /> : null};
                </Route>
                <Route path="/poker/:room_code">
                    <Table />
                </Route>

                <Route path="/sudoku/:room_code">
                    <Board />
                </Route>

                <Route path="/">
                    <Home authenticated={isAuthenticated}/>
                </Route>
            </Switch>
        </Router>

    )
  }
  
  export default Authenticated;
  