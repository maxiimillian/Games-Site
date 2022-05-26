import Image from "next/image";
import Link from "next/link";
import useAuth from "../contexts/authContext";
import React from "react";

import Home from "./main/Home";
import Loading from "./common/Loading";

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


        <React.Fragment>
            <div className="left-container">
                <div className="logo-container">
                    <Link href="/"><Image src="/logo.png" className="logo" width="30%" height="100%" alt="website icon" /></Link>
                </div>
            </div>
            <div className="center-container">
                {/* maybe put the Sign in/ username above the centr control thing */}
                <h1 className="site-title">Playholdr</h1>
                <Home />
            </div>
            <div className="right-container">
                
            </div>
        </React.Fragment>

    )
  }
  
  export default Authenticated;