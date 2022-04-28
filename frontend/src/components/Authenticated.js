


import { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import {
    Switch,
    Route,
    Link,
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
const Sudoku = lazy(() => import("./sudoku/Sudoku"));

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
                                    <Sudoku />
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