import { useState } from "react";
import Message from "./Message";

import wbfcru_profile from "../public/wbfrcu.png";

function Chatbox() {
    const [messages, setMessages] = useState([{"user": "Johnathon", "content": "hey"}, {"user": "wenis", "content": ":("}]);

    return (
        <div style={{display: "flex", flexDirection: "column", background: "#0f0f0f", padding: "20px", borderRadius: "15px"}}>
            <div class="opponent-container">
                <div class="user-info">
                    <div class="user">
                        <img class="profile" src={wbfcru_profile}></img>
                        <span class="name">Opponent 1</span>
                    </div>
                    <span class="opponent-percent">15/36 Squares</span>
                </div>
            </div>
            <div class="chat-container">
                <div class="chat-messages">
                    <ul>
                        {messages.map(message => {
                            return <li><Message user={message.user} content={message.content} /></li>
                        })}
                    </ul>
                </div>
                <input class="chat-input" placeholder="Start typing here..."></input>
            </div>
        </div>
    )
}

export default Chatbox;