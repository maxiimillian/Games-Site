


import { useCallback, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

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
function Authenticated({isAuthenticated}) {
    const [centerContent, setCenterContent] = useState("options");
    const [user, setUser] = useState({});


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

    return (
        <div className="top-container">
            <div className="logo-container">
                <img height={"5%"} width={"5%"} src={logo} ></img>
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
                <div className="center-container">
                    <CenterControl option={centerContent} />
                </div>
                <div className="right-container">
                    
                </div>
            </div>
        </div>
    )
  }
  
  export default Authenticated;
  