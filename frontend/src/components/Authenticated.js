


import { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    Redirect,
  } from "react-router-dom";
//import Home from "./Home";
//import Board from "./Board";
//import Table from "./Table";
import Chatbox from './Chatbox';
import Sidebar from "./Sidebar";
//import News from "./News";
import Blockpage from './Blockpage';

import { userContext } from "../contexts/userContext";
import { SoundProvider } from "../contexts/soundContext";


import Unauthenticated from './Unauthenticated';
import Username from "./Username";

import { faCog, faIdBadge, faGamepad } from '@fortawesome/free-solid-svg-icons'

import logo from '../public/logo.png';
import wenis_profile from '../public/wenis.jpg';
import other_profile from "../public/bingo.jpg";

const Home = lazy(() => import("./Home"));
const Table = lazy(() => import("./Table"));
const News = lazy(() => import("./News"));
const Board = lazy(() => import("./Board"));



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
    const [isLogin, setLogin] = useState(false);


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
            console.log(resp);
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
    //ok so maybe make the login form a component with a true/false statement and seperate the Sign In from the sidebar
    //then you can just turn it on with the sign in and off by clicking the BlockComponent 
    return (
        <SoundProvider>
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="top-container">
                        
                        <div className="logo-container">
                            <Link to="/"><img height={"5%"} width={"5%"} src={logo} ></img></Link>
                        </div>
                        
                        
                        <div className="page-container">
                            <Switch>

                                {isLogin ? 
                                    <div>
                                        <Blockpage handleClick={setLogin(false)}></Blockpage>
                                        <Unauthenticated handleSubmit={handleFormSubmit}/>
                                    </div>
                                : null
                                }

                                <Route path="/poker/:room_code">
                                    <div className="center-container">
                                        <Table />
                                    </div>
                                    <div className="right-container">
                                        <Chatbox />
                                    </div>
                                </Route>

                                <Route path="/sudoku/:room_code">
                                    <div className="left-container">
                                        <Username handleSignin={() => setLogin(true)} />
                                        <Sidebar />
                                    </div>      

                                    <Board />
                                </Route>

                                    <Route path="/">
                                        <div className="left-container">
                                            <Sidebar />
                                        </div>
                                        <div className="center-container">
                                            <Home />
                                        </div>
                                        <div className="right-container">
                                            <News />
                                        </div>
                                    </Route>

                            </Switch>
                            </div>
                        </div>
                    </Suspense>
                </Router>
            </SoundProvider>

    )
  }
  
  export default Authenticated;
  