


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
import Chatbox from './Chatbox';


import Unauthenticated from './Unauthenticated';


import logo from '../public/logo.png';
import wenis_profile from '../public/wenis.jpg';
import other_profile from "../public/bingo.jpg";



//<Board board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"} board_json={JSON.parse(data)}/>
// Change this to a router for home, sudoku, and poker. When you go to /sudoku/:gameid it attempts to join with that game code. If its the host then show a waiting screen, if it
// errors show errors, if its open then put into waiting screen and change on the start call
// I think just getting the token here is fine and no need to get token elsewhere but will do that after.
// figure out a way to create a game from the creator and then redirect elsewhere. Possibly make the websocket connection at CenterControl and pass it everywhere else.
// thats probably best actually lmao    

function Authenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [socket, setSocket] = useState()


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

    async function getData(callback) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token: localStorage.getItem("token")}),
        })
        .then(data => {
            return data.json()
            
        })
        .then(resp => {
            if (resp.success) {
                callback(resp)
                return;

            } else {
                callback({})
                return;

            }
        });
    }
    

    useEffect(() => {
        getData((resp) => {
            setUser(resp);
        })
    }, [isAuthenticated])

    useEffect(() => getToken(), []);

    return (

        <Router>
            <div className="top-container">
                
                <div className="logo-container">
                    <Link to="/"><img height={"5%"} width={"5%"} src={logo} ></img></Link>
                </div>
                
                
                <div className="page-container">

                    <div className="left-container">
                            <div className="main-user-info">
                                {Object.keys(user).length != 0 ? 
                                    <div class="main-user-container">
                                        <img class="main-user-profile" src={user.img_url}></img>
                                        <span class="main-user-name">{user.username}</span>
                                    </div>
                                    :
                                    <div class="main-user-container">
                                        <Link to="login"><span class="main-user-name">Sign In</span></Link>
                                    </div>
                                }


                            </div>
                            <div className="left-top-container">
                                <div class="main-user-info">

                                </div>
                                <div className="left-subcontainer">
                                    <div class="left-options-container">
                                            <div class="left-option">
                                                <div class="word-icon-combo">
                                                    <i class="fas fa-gamepad" aria-hidden="true"></i>
                                                    <span>Play</span>
                                                    
                                                </div>
                                            </div>

                                        </div>
                                </div>
                            </div>
                        </div>
                    
                    <Switch>
                        <Route path="/login">
                            <Unauthenticated handleSubmit={handleFormSubmit}/>
                            {isAuthenticated ? <Redirect to="/" /> : null};
                        </Route>

                        <Route path="/poker/:room_code">
                            <div className="center-container">
                                <Table />
                            </div>
                            <div className="left-container">
                                <Chatbox />
                            </div>
                        </Route>

                        <Route path="/sudoku/:room_code">
                            <div className="center-container">
                                <Board />
                            </div>
                            <div className="left-container">
                                <Chatbox />
                            </div>
                        </Route>

                        <Route path="/">
                            <div className="center-container">
                                <Home />
                            </div>
                        </Route>
                    </Switch>
                    </div>
                </div>
            </Router>


    )
  }
  
  export default Authenticated;
  