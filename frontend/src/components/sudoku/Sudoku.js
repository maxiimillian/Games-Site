import { React, useState, useEffect, useContext } from "react";
import { useParams, useLocation, Redirect } from "react-router-dom";
import { io } from "socket.io-client";

import Board from "./Board";
import Chatbox from "../common/Chatbox";
import ControlButton from "../common/ControlButton";
import { soundContext } from "../../contexts/soundContext";

import "../../styles/board.scss";
import "../../styles/chatbox.scss";
//test

function Sudoku(props) {
    const [baseIndex, setBaseIndex] = useState(getBase(props.board));
    const [boardData, setBoardData] = useState();

    const [rematch, setRematch] = useState(false);

    const [waiting, setWaiting] = useState(true);
    const [created, setCreated] = useState(false);

    const [room_code, setRoomCode] = useState(useParams().room_code);
    const [socket, setSocket] = useState(null);

    
    const [opponent, setOpponent] = useState(null);
    const [opponentScore, setOpponentScore] = useState(baseIndex.length);
    const [result, setResult] = useState(null);
    const [rematchStatus, setRematchStatus] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    const BOARD_DEFAULT_INDEX = [];;

    const sound = useContext(soundContext)

    let scoreText;
    let total;


    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();

    function getBaseJson(board_json) {

        let indexs = [];

        board_json.forEach((square, index) => {
            if (square.value != 0) {
                console.log(index, typeof index)
                indexs.push(index.toString());
            }
        })

        return indexs;
    }

    function getBase(board) {

        if (typeof board == "string") {
            let indexs = [];

            for (let i = 0; i < board.length; i++) {
                if (board[i] != 0) {
                    indexs.push(i.toString());
                }
            }
    
            return indexs;
    
        } else if (typeof board == "object") {
            return getBaseJson(board);
        } else {
            return getBase(BOARD_DEFAULT_INDEX);
        }


    }

    function handleRematch() {
        socket.emit("rematch", !rematchStatus);
        setRematchStatus(!rematchStatus);
    }

    function handleChatInput(e) {
        setChatInput(e.target.value);
    }

    function handleChatSubmit(e) {
        e.preventDefault();
        socket.emit("chat", chatInput);
        setChatInput("");
    }


    useEffect(() => {
        console.log("useeffect");
        let socket_conn = io(`${process.env.REACT_APP_API_URL}/sudoku`, {
            auth: {
                token: localStorage.getItem("token")
            }
        });
    
        setSocket(socket_conn);
    
        socket.on("connect", () => {
            console.log("connected");
        })
    
        if (query.get("create")) {
            let difficulty = query.get("difficulty")
            socket.emit("create", difficulty)
        } else {
            console.log("joining => ", room_code)
            socket.emit("join", room_code);
        }
    
        socket.on("created", (code) => {
            setRoomCode(code)
            setWaiting(true)
            setCreated(true)
            console.log(code, room_code);
        });
    
        socket.on("joined", (userInformation) => {
            setOpponent(userInformation);
        });
    
        socket.on("start", (data) => {
            console.log("started", data, data.board);
            setBaseIndex(getBase(data.board))
            setBoardData(data.board)
            setWaiting(false);
            sound("GameStarted");
        });
    
        socket.on("state", (board, opponentInfo) => {
            console.log(opponentInfo);
            setBaseIndex(getBase(board))
            setBoardData(board);
            setOpponent(opponentInfo.user);
            setOpponentScore(opponentInfo.score);
            setWaiting(false);
            sound("GameStarted");
        });
    
        //this is probably horrible, just figure out a way to unmount and have it join normally
        //i cant do this anymore
        //delete it ALL
        socket.on("redirect", (new_code, data) => {
            console.log("REDIRECTING => ", new_code)
            setBaseIndex(getBase(data.board))
            setBoardData(data.board)
            setWaiting(false);
            setRoomCode(new_code);
            setRematch(new_code);
        });
    
        socket.on("Filled square", (operation) => {
            if (operation == "add") {
                setOpponentScore(state => state + 1);
    
            } else if (operation == "subtract") {
                setOpponentScore(state => state - 1);
    
            }
            
        })
    
        socket.on("Winner", (result) => {
            setResult(result);
        })
    
        socket.on("chat", (message) => {
            console.log("CHAT => ", message)
            setMessages(prevMessages => [...prevMessages, message]);
        });
    
        socket.on("err", (message) => {
            console.log("ERR: ", message);
        });
    
        return () => {
            console.log("disconnecting")
            socket.disconnect();
        }
    }, [rematch])

    if (result == null) {
        scoreText = <span className="opponent-score">Opponent: {opponentScore}/{total}</span> 
        
    } else if (result == "win") {
        scoreText = 
        <div style={{display:"flex", flexDirection: "column"}}>
            <span className="opponent-score win">Opponent: {opponentScore}/81</span> 
            <span className="opponent-score win">You Won!</span> 
            <ControlButton 
                handleClick={() => handleRematch()}
                name={"Rematch"}
                class_on={"rematch-button active"}
                class_off={"rematch-button inactive"}
            />
        </div>
    } else {
        scoreText = <div>            
                        <span className="opponent-score lose">Opponent: Won</span> 
                        <ControlButton 
                            handleClick={() => handleRematch()}
                            name={"Rematch"}
                            class_on={"rematch-button active"}
                            class_off={"rematch-button inactive"}
                        />
                    </div>
        
    }

    return(
        <div className="board-top-container">
            <Board board={boardData}/>
            <div className="right-chat-container">
                <div className="chat-top-container">
                    <div class="opponent-container">
                        <div class="user-info">
                            <div class="user">
                                <span class="name">{opponent == null ? "Guest" : opponent.username}</span>
                            </div>
                        </div>
                    </div>
                    <div class="chat-container">
                        <Chatbox messages={messages} />
                        <form onSubmit={(e) => handleChatSubmit(e)}>
                            <input class="chat-input" 
                                onSubmit={(e) => handleChatSubmit(e)} 
                                placeholder="Start typing here..." value={chatInput} 
                                onChange={(e) => handleChatInput(e)}>
                            </input>
                            <input type="submit" style={{display: "none"}}></input>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sudoku;