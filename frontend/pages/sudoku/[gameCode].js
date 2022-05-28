import { React, useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router'
import { io } from "socket.io-client";
import Head from "next/head";

import Sidebar from "../../components/main/Sidebar";
import Board from "../../components/sudoku/Board";
import Waiting from "../../components/sudoku/Waiting";
import Chatbox from "../../components/common/Chatbox";
import ControlButton from "../../components/common/ControlButton";
import Error from "../../components/common/Error";
import { soundContext } from "../../contexts/soundContext";

import styles from "../../styles/chatbox.module.scss";
import boardStyles from "../../styles/board.module.scss";

const BOARD_DEFAULT_INDEX = "0404";

class Cell {
    constructor(value, annotations) {
        this.value = value;
        this.annotations = annotations;
    }
}

export async function getServerSideProps(context) {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sudoku/details/${context.query.gameCode}`);
    let responseJson = await response.json();

    if (responseJson == undefined) {
        return;
    }

    return {
        props: {
            gameDetails: responseJson,
        }
    }

}

function Sudoku(props) {
    const [baseIndex, setBaseIndex] = useState([0]);
    const [boardData, setBoardData] = useState(defaultBoard());

    const [rematch, setRematch] = useState(false);

    const [waiting, setWaiting] = useState(true);
    const [created, setCreated] = useState(false);

    const [playerCount, setPlayerCount] = useState(0);
    const [playerTotal, setPlayerTotal] = useState(0);
    const [options, setOptions] = useState({"players": null, "time": null, "host": null, "difficulty": null});
    const [socket, setSocket] = useState(null);

    
    const [opponent, setOpponent] = useState(null);
    const [opponentScore, setOpponentScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [infoText, setInfoText] = useState("0 / 0");
    const [result, setResult] = useState(null);
    const [rematchStatus, setRematchStatus] = useState(false);

    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [error, setError] = useState("");

    const sound = useContext(soundContext)

    const router = useRouter();
    const { gameCode } = router.query;
    console.log(props.gameDetails)
    const gameDetails = props.gameDetails.details;

    let scoreText;
    let head;

    useEffect(() => {
        if (waiting && gameCode != undefined) {
            getDetails(gameCode);
        }
    }, [waiting, router.isReady])

    useEffect(() => {
        console.log(rematchStatus);
        if (socket != null) {
            socket.emit("rematch", rematchStatus);
        }
    }, [rematchStatus])

    useEffect(() => {
        setInfoText(`${opponentScore} / ${total}`);
    }, [opponentScore, total])

    async function getDetails(code) {
        let detailsList = [];

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sudoku/details/${code}`)
        .then(response => response.json())
        .then(response => {
            if (response.details == undefined) {
                return;
            }
            let details = response.details;

            setPlayerTotal(details.players);
            setOptions(details)
        });
        
    }

    function defaultBoard() {
        var board_create = [];

        for (let i = 0; i < 81; i++) {
            board_create.push(
                new Cell("0", [])
            );

        }
        return board_create
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
        console.log(baseIndex, index, baseIndex.includes(index), typeof index, typeof baseIndex[0]);
        if (baseIndex.includes(parseInt(index))) {
            return;
        }
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
        if (!gameCode) { //wait for gameCode to be ready
            return;
        }
        let socket_conn = io(`${process.env.NEXT_PUBLIC_API_URL}/sudoku`, {
            auth: {
                token: localStorage.getItem("token")
            }
        });

        console.log(socket_conn, localStorage.getItem("token"));
    
        socket_conn.on("connect", () => {
            socket_conn.emit("join", gameCode);
        })
    

    
        socket_conn.on("created", (code) => {
            setRoomCode(code)
            setWaiting(true)
            setCreated(true)
            console.log(code, gameCode);
        });
    
        socket_conn.on("joined", (userInformation, gameOptions) => {
            setOpponent(userInformation);
        });
    
        socket_conn.on("start", (data) => {
            setOpponentScore(0);
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
            router.push(`/sudoku/${new_code}`);
            setOpponentScore(0);
            setRematchStatus(false);
            setResult(null);
            setBaseIndex(data.base);
            setBoardData(createBoard(data.board));
            setTotal(81-data.base.length);
            setInfoText(`${opponentScore} / ${total}`);
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
            setError(message);
        });

        setSocket(socket_conn);
    
        return () => {
            socket_conn.disconnect();
        }
    }, [rematch, router.isReady])
    
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

    if (gameDetails) {
        console.log("gd", gameDetails)
        head = (<Head>
            <meta charSet="utf-8" />
            <meta name="description" content={"Click the link to join"} />
    
            <meta name="og:title" content={`Sudoku Challenge from ${gameDetails.host} - ${gameDetails.difficulty} difficulty`} />
            <meta name="og:site_name" content={"Playholdr"} />
            <meta name="og:description" content={"Click the link to join"} />
        </Head>)
    } else {
        return (
            <div className={boardStyles["board-top-container"]}>
                <Sidebar />
                <Error errorMessage={error} />
            </div>      
        )
    }


    if (waiting) {
        return (
            <div className={boardStyles["board-top-container"]}>
                {head}
                <Sidebar />
                <Waiting code={gameCode} options={options} player_total={playerTotal} player_count={playerCount} />
            </div>
        )
    }

    return (
        <div className={boardStyles["board-top-container"]}>
            {head}
            <Sidebar />
            <Board key={boardData} handleInput={handleInput} handleAnnotate={handleAnnotate} handleReset={handleReset} board={boardData} base={baseIndex} waiting={false}/>

                {scoreText}
                <div className={styles["chat-top-container"]}>
                    <div className={styles["opponent-container"]}>
                        <div className={styles["user-info"]}>
                            <div className="user">
                                <span className={styles["name"]}>{opponent == null ? "Guest" : opponent.username}</span><span className={styles["opponent-score"]}>{infoText}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles["chat-container"]}>
                        <Chatbox messages={messages} />
                        <form onSubmit={(e) => handleChatSubmit(e)}>
                            <input className={styles["chat-input"]} 
                                onSubmit={(e) => handleChatSubmit(e)} 
                                placeholder="Start typing here..." value={chatInput} 
                                onChange={(e) => handleChatInput(e)}>
                            </input>
                            <input type="submit" style={{display: "none"}}></input>
                        </form>

                    </div>
                </div>

        </div>
    )
}

export default Sudoku;