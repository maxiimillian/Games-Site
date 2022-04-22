import { React, useState, useEffect, useContext } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { io } from "socket.io-client";

import Board from "./Board";
import Chatbox from "../common/Chatbox";
import ControlButton from "../common/ControlButton";
import { soundContext } from "../../contexts/soundContext";

import "../../styles/board.scss";
import "../../styles/chatbox.scss";

const BOARD_DEFAULT_INDEX = "0404";

function Sudoku(props) {
    const [baseIndex, setBaseIndex] = useState([0]);
    const [boardData, setBoardData] = useState();

    const [rematch, setRematch] = useState(false);

    const [waiting, setWaiting] = useState(true);
    const [created, setCreated] = useState(false);

    const [room_code, setRoomCode] = useState(useParams().room_code);
    const [socket, setSocket] = useState(null);

    
    const [opponent, setOpponent] = useState(null);
    const [opponentScore, setOpponentScore] = useState();
    const [result, setResult] = useState(null);
    const [rematchStatus, setRematchStatus] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    const sound = useContext(soundContext)

    let scoreText;
    let total;

    useEffect(() => {
        console.log("updated => ", boardData);
    }, [boardData])

    useEffect(() => {
        console.log(rematchStatus);
        if (socket != null) {
            socket.emit("rematch", rematchStatus);
        }
    }, [rematchStatus])

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    let location = useLocation();
    let history = useHistory();

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

    function handleInput(value, index) {
        let newBoardData = `${boardData}`

        newBoardData = newBoardData.split('');
        newBoardData[index] = value;
        newBoardData = newBoardData.join('');
        //console.log("r2", `${boardData.slice(0, index)}${value}${boardData.slice(index+1, 82)}`)

        socket.emit("move", index, value);
        setBoardData(newBoardData);
    }

    function handleRematch() {
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
        let socket_conn = io(`${process.env.REACT_APP_API_URL}/sudoku`, {
            auth: {
                token: localStorage.getItem("token")
            }
        });
    
        socket_conn.on("connect", () => {
            console.log("connected");
            if (query.get("create")) {
                let difficulty = query.get("difficulty")
                socket_conn.emit("create", difficulty)
            } else {
                console.log("joining => ", room_code)
                socket_conn.emit("join", room_code);
            }
        })
    

    
        socket_conn.on("created", (code) => {
            setRoomCode(code)
            setWaiting(true)
            setCreated(true)
            console.log(code, room_code);
        });
    
        socket_conn.on("joined", (userInformation) => {
            setOpponent(userInformation);
        });
    
        socket_conn.on("start", (data) => {
            console.log("started", data, data.board);
            setBaseIndex(getBase(data.board))
            setBoardData(data.board)
            setWaiting(false);
            setRematchStatus(false);
            sound("GameStarted");
        });
    
        socket_conn.on("state", (board, opponentInfo) => {
            console.log(opponentInfo);
            console.log("BOARD REC => ", board);
            setBaseIndex(getBase(board))
            setBoardData(board);
            setOpponent(opponentInfo.user);
            setOpponentScore(opponentInfo.score);
            setWaiting(false);
            setRematchStatus(false);
            sound("GameStarted");
        });
    
        socket_conn.on("redirect", (new_code, data) => {
            console.log("REDIRECTING => ", new_code)
            history.push(`/sudoku/${new_code}`);
            setRematchStatus(false);
            setResult(null);
            setBaseIndex(getBase(data.board));
            setBoardData(data.board);
            setRoomCode(new_code);
        });
    
        socket_conn.on("Filled square", (operation) => {
            if (operation == "add") {
                setOpponentScore(state => state + 1);
    
            } else if (operation == "subtract") {
                setOpponentScore(state => state - 1);
    
            }
            
        })
    
        socket_conn.on("Winner", (result) => {
            setResult(result);
        })
    
        socket_conn.on("chat", (message) => {
            console.log("CHAT => ", message)
            setMessages(prevMessages => [...prevMessages, message]);
        });
    
        socket_conn.on("err", (message) => {
            console.log("ERR: ", message);
        });

        setSocket(socket_conn);
    
        return () => {
            console.log("disconnecting")
            socket_conn.disconnect();
        }
    }, [rematch])

    if (result == "win") {
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
    } else if (result == "lose") {
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
            <Board key={boardData} handleInput={handleInput} board={boardData} base={baseIndex} waiting={false}/>
            <div className="right-chat-container">
                {scoreText}
                <div className="chat-top-container">
                    <div class="opponent-container">
                        <div class="user-info">
                            <div class="user">
                                <span class="name">{opponent == null ? "Guest" : opponent.username}</span><span className="opponent-score">{opponentScore}/{total}</span>
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