


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

import Chatbox from './common/Chatbox';
import Sidebar from "./main/Sidebar";

import Blockpage from './common/Blockpage';

import useAuth from "../contexts/authContext";
import { SoundProvider } from "../contexts/soundContext";
import Loading from "./common/Loading";

import Unauthenticated from './Unauthenticated';

import logo from '../public/logo.png';

const Home = lazy(() => import("./main/Home"));
const Table = lazy(() => import("./poker/Table"));
const News = lazy(() => import("./News"));
const Board = lazy(() => import("./sudoku/Board"));

let template_articles = [
    {"author": "John Doe", "date": "3d", "title": "This is an article about absolutely nothing."},
    {"author": "John Doe", "date": "3d", "title": "This is an article about absolutely nothing."},
    {"author": "John Doe", "date": "3d", "title": "This is an article about absolutely nothing."},
]


//<Board board_string={"050000002001000600968000004090010000015000940000900073100350090006001800000004000"} board_json={JSON.parse(data)}/>
// Change this to a router for home, sudoku, and poker. When you go to /sudoku/:gameid it attempts to join with that game code. If its the host then show a waiting screen, if it
// errors show errors, if its open then put into waiting screen and change on the start call
// I think just getting the token here is fine and no need to get token elsewhere but will do that after.
// figure out a way to create a game from the creator and then redirect elsewhere. Possibly make the websocket connection at CenterControl and pass it everywhere else.
// thats probably best actually lmao    

function Authenticated() {

    const {user, loading, error} = useAuth();

    if (loading) return <Loading />



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
    

    /*useEffect(() => {
        getData((resp) => {
            setUser(resp);
        })
    }, [isAuthenticated])

    useEffect(() => getToken(), []);*/

    return (
        <SoundProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="top-container">
                        
                        
                        <div className="page-container">
                            <Switch>
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
                                        <Sidebar />
                                    </div>      

                                    <Board />
                                </Route>

                                    <Route path="/">
                                        <div className="left-container">
                                            <div className="logo-container">
                                                <Link to="/"><img className="logo" width="30%" src={logo} alt="website icon"></img></Link>
                                            </div>
                                        </div>
                                        <div className="center-container">
                                            {/* maybe put the Sign in/ username above the centr control thing */}
                                            <h1 className="site-title">Playholdr</h1>
                                            <Home />
                                        </div>
                                        <div className="right-container">
                                            
                                        </div>
                                    </Route>

                            </Switch>
                            </div>
                        </div>
                    </Suspense>
            </SoundProvider>

    )
  }
  
  export default Authenticated;
  