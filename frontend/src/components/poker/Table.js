import { React, useState, Component, useEffect } from "react";
import {io} from 'socket.io-client' 

export default function Table(props) {
    const [players, setPlayers] = useState([]);
    const [actions, setActions] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(()=> {
        
        let socket_return = io(`${process.env.REACT_APP_API_URL}/poker`, {
            auth: {
                token: localStorage.getItem("token")
            }
        });
        setSocket(socket_return);

        return () => {
            console.log("returning")
            console.log(socket_return);
            console.log(socket);
            let test = socket_return.disconnect();
            console.log(test);


        }
    }, [setSocket])
    

    return (
        <div>
            <div className="players-container">
                <button onClick={() => {socket.emit("create")}}>Click me</button>
       
            </div>
        </div>
    )
}