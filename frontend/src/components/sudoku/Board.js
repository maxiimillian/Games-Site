import { React, useState, useEffect, useContext } from "react";
import { useParams, useLocation, Redirect } from "react-router-dom";
import { io } from "socket.io-client";

import Chatbox from "../common/Chatbox";
import ControlButton from "../common/ControlButton";
import { soundContext } from "../../contexts/soundContext";

import "../../styles/board.scss"
import "../../styles/chatbox.scss"

const BOARD_DEFAULT = "0".repeat(81);
const BOARD_DEFAULT_INDEX = [];

class Cell {
    constructor(value, annotations) {
        this.value = value;
        this.annotations = annotations;
    }
}

export default function Board(props) {
    const [board, setBoard] = useState(createBoard(props.board));
    const [startingBoard, setStartingBoard] = useState(null);
    const [baseIndex, setBaseIndex] = useState(getBase(props.board));
    const [highlightIndex, setHighlightIndex] = useState(82);
    const [annotate, setAnnotate] = useState(false);

    const [opponent, setOpponent] = useState(null);
    const [rematch, setRematch] = useState(false);

    const [waiting, setWaiting] = useState(true);
    const [created, setCreated] = useState(false);

    const [room_code, setRoomCode] = useState(useParams().room_code);
    const [socket, setSocket] = useState(null);

    const [opponentScore, setOpponentScore] = useState(baseIndex.length);
    const [result, setResult] = useState(null);
    const [rematchStatus, setRematchStatus] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");

    const ALLOWED_INPUTS = [0,1,2,3,4,5,6,7,8,9];

    let sound = useContext(soundContext)
    
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();

    useEffect(() => {
        console.log("useeffect");
        let socket = io(`${process.env.REACT_APP_API_URL}/sudoku`, {
            auth: {
                token: localStorage.getItem("token")
            }
        });

        setSocket(socket);

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
            setBoard(createBoard(data.board))
            setWaiting(false);
            setStartingBoard(data.board);
            sound("GameStarted");
        });

        socket.on("state", (board, opponentInfo) => {
            console.log(opponentInfo);
            setBaseIndex(getBase(board))
            setBoard(createBoard(board));
            setOpponent(opponentInfo.user);
            setOpponentScore(opponentInfo.score);
            setWaiting(false);
            setStartingBoard(board);
            sound("GameStarted");
        });

        //this is probably horrible, just figure out a way to unmount and have it join normally
        //i cant do this anymore
        //delete it ALL
        socket.on("redirect", (new_code, data) => {
            console.log("REDIRECTING => ", new_code)
            setBaseIndex(getBase(data.board))
            setBoard(createBoard(data.board))
            setWaiting(false);
            setStartingBoard(data.board);
            setRoomCode(new_code);
            setRematch(new_code);
        });

        socket.on("Filled square", (operation) => {
            console.log("???")
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

    

    useEffect(() => {
        window.addEventListener("keydown", handleEventInput);
        return () => {
            window.removeEventListener("keydown", handleEventInput);
        };
    }, [highlightIndex, annotate]);

    function handleRematch() {
        socket.emit("rematch", !rematchStatus);
        setRematchStatus(!rematchStatus);
    }

    function handleChatInput(e) {
        setHighlightIndex(82);
        setChatInput(e.target.value);
    }

    function handleChatSubmit(e) {
        e.preventDefault();
        socket.emit("chat", chatInput);
        setChatInput("");
    }

    function handleEventInput({key}) {
        if (
            ALLOWED_INPUTS.includes(parseInt(key)) 
            && !(baseIndex.includes(highlightIndex)) 
            && !(annotate && key == 0) 
            && (highlightIndex >= 0 && highlightIndex < 82) 
            && board[highlightIndex].value != key
            ) {
            let cells = [...board];

            if (annotate) {
                console.log("annotated")
                let annotations = cells[highlightIndex].annotations;
                if (annotations.includes(key)) {
                    let index = annotations.indexOf(key);

                    if (index > -1) {
                        annotations.splice(index, 1);
                    }
                } else {
                    annotations.push(...key);
                }
                cells[highlightIndex].annotations = annotations;
                
                
            } else {
                socket.emit("move", highlightIndex, key)

                cells[highlightIndex].value = key;
                cells[highlightIndex].annotations = [];

            }
            
            setBoard(cells);
        }
 
    }

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
        } else {
            return createBoard(BOARD_DEFAULT);
        }

    }

    function resetBoard() {
        setBoard(createBoard(startingBoard))
    }

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

    function handleCellClick(e) {
        let index = e.currentTarget.getAttribute("data-index")
        console.log(index, e);
        setHighlightIndex(index);
        console.log(highlightIndex)

    }

    function searchSquare(axis, index) {
        let highlight = 0;
        let test = 0;

        let x = 0;
        let y = 0;
        
        function which_axis() {
            if (axis == "x") return x;
            if (axis == "y") return y;
        }

        board.map((cell, i) => {
            if (i == highlightIndex) highlight = which_axis();
            if (i == index) test = which_axis();

            x += 1;
            if (x % 9 == 0) {
                y += 1;
                x = 0;
            }
        })

        return highlight == test;
    }

    function getAxis(axis, index) {
        let x = 0;
        let y = 0;

        for (let i = 0; i < board.length; i++) {
            if (i == index) {
                if (axis == "x") return x;
                else if (axis == "y") return y;
            }

            x += 1;
            if (x % 9 == 0) {
                y += 1;
                x = 0;
            }
        }
    }

    function adjacentY(index) {
        let square_y = getAxis("y", index)+1;

        if (square_y <= 3) {
            return 1;
        }
        else if (square_y <= 6) {
            return 2;
        } 
        else if (square_y <= 9) {
            return 3;
        }
    }
    function adjacentX(index) {
        let square_x = getAxis("x", index)+1;
        
        if (square_x <= 3) {
            return [1, adjacentY(index)];
        }
        else if (square_x <= 6) {
            return [2, adjacentY(index)];
        } 
        else if (square_x <= 9) {
            return [3, adjacentY(index)];
        }
    }

    function isAdjacentBox(index) {
        let test = adjacentX(index);
        let highlight = adjacentX(highlightIndex);
        
        return test[0] == highlight[0] && test[1] == highlight[1];
    }

    function isAdjacent(index) {
        if (highlightIndex < 0 || highlightIndex > 81 || highlightIndex == null) {
            return false;
        }
        let row = searchSquare("y", index);
        let col = searchSquare("x", index);
        let box = isAdjacentBox(index);

        //console.log(row, col, box, index);
        return row || col || box;
    }



    function createRow(limit) {
        return (
            <tr>
            {board.map((cell, index) => {
                //console.log(limit-9, limit-1)
                if (index >= limit-9 && index <= limit-1) {

                    let highlighted = (index == highlightIndex) ? "highlighted-square" : "";
                    let highlighted_adjacent = isAdjacent(index) ? "highlighted-adjacent" : "";
                    let is_base = (baseIndex.includes(index.toString())) ? "base-number": "";

                    let annotate_number = 0;

                    return (
                        <td key={index} onClick={handleCellClick} data-index={index} className={`${highlighted} ${highlighted_adjacent} ${is_base}`}>
                            {cell.value == "0" ? "" : cell.value}
                            <div class="cell-overlay">
                                {cell.annotations.map((annotation) => {
                                    annotate_number += 1;
                                    return <div key={annotate_number} class="overlay-number">{annotation}</div>
                                })}
                            </div>
                        </td>
                    )
                }
            })}
            </tr>
        )
    }

    let scoreText;
    let total;

    if (startingBoard) {
        total = (startingBoard.match(/0/g) || []).length
    } else {
        total = 0;
    }
    

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

    return (
        <div className="board-top-container">
            <div className="center-board-container">
                {created ? <Redirect to={`/sudoku/${room_code}`} /> : null }
                {rematch ? <Redirect to={`/sudoku/${rematch}`} /> : null}
                <div className="board-container">
                    <table className={`board ${waiting ? "fade-out": null}`}>
                        <colgroup><col></col><col></col><col></col></colgroup>
                        <colgroup><col></col><col></col><col></col></colgroup>
                        <colgroup><col></col><col></col><col></col></colgroup>

                        <tbody>
                            {createRow(9)}
                            {createRow(18)}
                            {createRow(27)}
                        </tbody>
                        <tbody>
                            {createRow(36)}
                            {createRow(45)}
                            {createRow(54)}
                        </tbody>
                        <tbody>
                            {createRow(63)}
                            {createRow(72)}
                            {createRow(81)}
                        </tbody>
                    </table>
                    <div className={`control-bar ${waiting ? "fade-out": null}`}>
                        {scoreText}   
                        <ControlButton handleClick={() => setAnnotate(!annotate)} name={"annotate"} />
                        <ControlButton handleClick={() => resetBoard()} name={"Reset"} />
                    </div>
                </div>
                
            </div>
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
                                onChange={(e) => handleChatInput(e)}
                                onClick={() => setHighlightIndex(82)}>
                            </input>
                            <input type="submit" style={{display: "none"}}></input>
                        </form>

                    </div>
                </div>
                
            </div>
        </div>
    )
}