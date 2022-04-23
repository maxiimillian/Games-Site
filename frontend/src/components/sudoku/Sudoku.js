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

class Cell {
    constructor(value, annotations) {
        this.value = value;
        this.annotations = annotations;
    }
}

function Sudoku(props) {
    const [baseIndex, setBaseIndex] = useState([0]);
    const [boardData, setBoardData] = useState(defaultBoard());

    const [rematch, setRematch] = useState(false);

    const [waiting, setWaiting] = useState(true);
    const [created, setCreated] = useState(false);

    const [room_code, setRoomCode] = useState(useParams().room_code);
    const [socket, setSocket] = useState(null);

    
    const [opponent, setOpponent] = useState(null);
    const [opponentScore, setOpponentScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [infoText, setInfoText] = useState("0 / 0");
    const [result, setResult] = useState(null);
    const [rematchStatus, setRematchStatus] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    const sound = useContext(soundContext)

    let scoreText;

    useEffect(() => {
        console.log(rematchStatus);
        if (socket != null) {
            socket.emit("rematch", rematchStatus);
        }
    }, [rematchStatus])

    useEffect(() => {
        setInfoText(`${opponentScore} / ${total}`);
    }, [opponentScore, total])

    function defaultBoard() {
        var board_create = [];

        for (let i = 0; i < 81; i++) {
            board_create.push(
                new Cell("0", [])
            );

        }
        return board_create
    }

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    let location = useLocation();
    let history = useHistory();

    function createBoardJson(board_json) {
        var board_create = [];

        board_json.forEach(square => {
            board_create.push(
                new Cell(square.value, square.candidates)
            );
        })
        return board_create;
    }

    function createBoard(board) {
        var board_create = [];

        if (typeof board == "string") {
            for (let i = 0; i < board.length; i++) {
                board_create.push(
                    new Cell(board[i], [])
                );
    
            }
            return board_create;
    
        } else if (typeof board == "object") {
            return createBoardJson(board);

        } else if (typeof board == "array") {
            board_create.map(square => {
                board_create.push(
                    new Cell(square, [])
                )
            });
            return board_create;

        } else {
            return createBoard("0".repeat(81));
        }

    }
    function handleInput(value, index) {
        let newBoard = boardData.slice();
        newBoard[index].value = value;
        newBoard[index].annotations = [];

        socket.emit("move", index, value);
        setBoardData(newBoard);
    }

    function handleAnnotate(value, index) {
        let newBoard = boardData.slice();
        let currentAnnotations = newBoard[index].annotations;
        newBoard[index].value = "0";

        if (currentAnnotations.includes(value)) {
            let currentIndex = currentAnnotations.indexOf(value);
            if (currentIndex > -1) {
                currentAnnotations.splice(value, 1);
            }
        } else {
            currentAnnotations.push(value);
        }

        newBoard[index].annotations = currentAnnotations;
        setBoardData(newBoard);
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

    function handleReset() {
        let newBoard = boardData.slice();
        newBoard.map((square, index) => {
            if (!baseIndex.includes(index)) {
                square.value = "0";
                socket.emit("move", index, square.value);
            }
        });

        setBoardData(newBoard);
    }


    useEffect(() => {
        let socket_conn = io(`${process.env.REACT_APP_API_URL}/sudoku`, {
            auth: {
                token: localStorage.getItem("token")
            }
        });
    
        socket_conn.on("connect", () => {
            if (query.get("create")) {
                let difficulty = query.get("difficulty")
                socket_conn.emit("create", difficulty)
            } else {
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
            setBaseIndex(data.base)
            setBoardData(createBoard(data.board))
            setWaiting(false);
            setRematchStatus(false);
            setTotal(81-data.base.length);
            setInfoText(`${opponentScore} / ${total}`);
            sound("GameStarted");
        });
    
        socket_conn.on("state", (data, opponentInfo) => {
            setBaseIndex(data.base);
            setBoardData(createBoard(data.board));
            setOpponent(opponentInfo.user);
            setOpponentScore(opponentInfo.score);
            setWaiting(false);
            setRematchStatus(false);
            setTotal(81-data.base.length);
            setInfoText(`${opponentScore} / ${total}`);
            sound("GameStarted");
        });
    
        socket_conn.on("redirect", (data, new_code) => {
            history.push(`/sudoku/${new_code}`);
            setRematchStatus(false);
            setResult(null);
            setBaseIndex(data.base);
            setBoardData(createBoard(data.board));
            setTotal(81-data.base.length);
            setInfoText(`${opponentScore} / ${total}`);
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
            setInfoText(`You ${result}!`);
        })
    
        socket_conn.on("chat", (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });
    
        socket_conn.on("err", (message) => {
            console.log("ERR: ", message);
        });

        setSocket(socket_conn);
    
        return () => {
            socket_conn.disconnect();
        }
    }, [rematch])

    if (result == "win") {
        scoreText = 
        <div style={{display:"flex", flexDirection: "column"}}>
            <ControlButton 
                handleClick={() => handleRematch()}
                name={"Rematch"}
                class_on={"rematch-button active"}
                class_off={"rematch-button inactive"}
            />
        </div>
    } else if (result == "lose") {
        scoreText = <div>            
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
            <Board key={boardData} handleInput={handleInput} handleAnnotate={handleAnnotate} handleReset={handleReset} board={boardData} base={baseIndex} waiting={false}/>
            <div className="right-chat-container">
                {scoreText}
                <div className="chat-top-container">
                    <div class="opponent-container">
                        <div class="user-info">
                            <div class="user">
                                <span class="name">{opponent == null ? "Guest" : opponent.username}</span><span className="opponent-score">{infoText}</span>
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