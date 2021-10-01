


import { useCallback, useEffect, useState } from 'react';

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
function Authenticated() {
    const [centerContent, setCenterContent] = useState("options");
    const [user, setUser] = useState({});
    const [loginForm, setLoginForm] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function handleFormSubmit() {
        setLoginForm(false);
        setIsAuthenticated(true);
    }

    async function getToken() {
        const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
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
                console.log(resp);
                localStorage.setItem("token", resp.token);
                setIsAuthenticated(true);
            } else {
                console.log("nah", resp);
                localStorage.setItem("token", "nope");
            }
        } )
    };

    async function getData(callback) {
        const response = await fetch(`${process.env.API_URL}/auth/profile`, {
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
            console.log(resp);
            if (resp.success) {
                console.log("data");
                callback(resp)
                return;
            } else {
                console.log("nah");
                callback({})
                return;
            }
        });
    }

    useEffect(() => getToken(), []);

    useEffect(() => {
        if (!isAuthenticated) return;
        getData(resp => {
            setUser(resp);
        });
        setIsAuthenticated(false);
    }, [isAuthenticated]);

    return (
        <div className="top-container">
            {loginForm ? 
                <Unauthenticated handleSubmit={handleFormSubmit}/>
                :
                null
            }
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
                                <span onClick={() => setLoginForm(true)} class="main-user-name">Sign In</span>
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
                    <Chatbox />
                </div>
            </div>
        </div>
    )
  }
  
  export default Authenticated;
  