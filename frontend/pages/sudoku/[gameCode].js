import { React, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import Head from "next/head";

import Sidebar from "../../components/main/Sidebar";
import Board from "../../components/sudoku/Board";
import Waiting from "../../components/sudoku/Waiting";
import Chatbox from "../../components/common/Chatbox";
import ControlButton from "../../components/common/ControlButton";
import NumberButton from "../../components/buttons/NumberButton";
import Error from "../../components/common/Error";
import { soundContext } from "../../contexts/soundContext";
import useAuth from "../../contexts/authContext";
import { isAdjacent } from "../../components/sudoku/sudokuUtils";

import styles from "../../styles/chatbox.module.scss";
import boardStyles from "../../styles/board.module.scss";
import getConfig from "next/config";

const BOARD_DEFAULT_INDEX = "0404";
const { publicRuntimeConfig } = getConfig();
class Cell {
  constructor(value, annotations) {
    this.value = value;
    this.annotations = annotations;
  }
}

export async function getServerSideProps(context) {
  let response = await fetch(
    `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/sudoku/details/${context.query.gameCode}`
  );
  let responseJson = await response.json();

  if (responseJson == undefined) {
    return;
  }

  return {
    props: {
      gameDetails: responseJson,
    },
  };
}

function Sudoku(props) {
  const router = useRouter();

  const [baseIndex, setBaseIndex] = useState([0]);
  const [boardData, setBoardData] = useState(defaultBoard());

  const [rematch, setRematch] = useState(false);

  const [waiting, setWaiting] = useState(true);
  const [created, setCreated] = useState(false);

  const [playerCount, setPlayerCount] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [options, setOptions] = useState({
    players: null,
    time: null,
    host: null,
    difficulty: null,
  });
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
  const [gameCode, setGameCode] = useState(router.query.gameCode || null);
  const sound = useContext(soundContext);
  const { user, loading } = useAuth();

  const gameDetails = props.gameDetails.details;

  let scoreText;
  let head;

  useEffect(() => {
    if (waiting && gameCode != undefined) {
      getDetails(gameCode);
    }
  }, [waiting, router.isReady]);

  useEffect(() => {
    if (socket != null) {
      socket.emit("rematch", rematchStatus);
    }
  }, [rematchStatus]);

  useEffect(() => {
    setInfoText(`${opponentScore} / ${total}`);
  }, [opponentScore, total]);

  async function getDetails(code) {
    let detailsList = [];

    await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/sudoku/details/${code}`)
      .then((response) => response.json())
      .then((response) => {
        if (response.details == undefined) {
          return;
        }
        let details = response.details;

        setPlayerTotal(details.players);
        setOptions(details);
      });
  }

  function defaultBoard() {
    var board_create = [];

    for (let i = 0; i < 81; i++) {
      board_create.push(new Cell("0", []));
    }
    return board_create;
  }

  function createBoardJson(board_json) {
    var board_create = [];

    board_json.forEach((square) => {
      board_create.push(new Cell(square.value, square.candidates));
    });
    return board_create;
  }

  function createBoard(board) {
    var board_create = [];

    if (typeof board == "string") {
      for (let i = 0; i < board.length; i++) {
        board_create.push(new Cell(board[i], []));
      }
      return board_create;
    } else if (typeof board == "object") {
      return createBoardJson(board);
    } else if (typeof board == "array") {
      board_create.map((square) => {
        board_create.push(new Cell(square, []));
      });
      return board_create;
    } else {
      return createBoard("0".repeat(81));
    }
  }

  function handleInput(value, index) {
    if (baseIndex.includes(parseInt(index))) {
      return;
    }
    let newBoard = boardData.slice();
    newBoard[index].value = value;
    newBoard[index].annotations = [];

    newBoard.map((cell, testIndex) => {
      if (isAdjacent(index, testIndex, newBoard)) {
        if (newBoard[testIndex].annotations.includes(value)) {
          let conflictingAnnotationIndex =
            newBoard[testIndex].annotations.indexOf(value);
          newBoard[testIndex].annotations.splice(conflictingAnnotationIndex, 1);
        }
      }
    });

    socket.emit("move", index, value);
    setBoardData(newBoard);
  }

  function handleAnnotate(value, index) {
    let newBoard = boardData.slice();
    let currentAnnotations = newBoard[index].annotations.slice();
    newBoard[index].value = "0";

    if (currentAnnotations.includes(value)) {
      let currentIndex = currentAnnotations.indexOf(value);
      if (currentIndex > -1) {
        currentAnnotations.splice(currentIndex, 1);
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
      newBoard[index].annotations = [];
      if (!baseIndex.includes(index)) {
        square.value = "0";
        socket.emit("move", index, square.value);
      }
    });

    setBoardData(newBoard);
  }

  useEffect(() => {
    if (!gameCode || loading || !publicRuntimeConfig.NEXT_PUBLIC_API_URL) {
      //wait for gameCode to be ready
      return;
    }

    const game_conn = io(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/sudoku`, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    game_conn.on("connect", () => {
      game_conn.emit("join", gameCode);
    });

    game_conn.on("created", (code) => {
      setRoomCode(code);
      setWaiting(true);
      setCreated(true);
    });

    game_conn.on("joined", (userInformation, gameOptions) => {
      setOpponent(userInformation);
    });

    game_conn.on("start", (data) => {
      setOpponentScore(0);
      setBaseIndex(data.base);
      setBoardData(createBoard(data.board));
      setWaiting(false);
      setRematchStatus(false);
      setTotal(81 - data.base.length);
      setInfoText(`${opponentScore} / ${total}`);
      sound("GameStarted");
    });

    game_conn.on("state", (data, opponentInfo) => {
      setBaseIndex(data.base);
      setBoardData(createBoard(data.board));
      setOpponent(opponentInfo[0].user); // temp set this to first index until frontend can handle more players
      setOpponentScore(opponentInfo[0].score);
      setWaiting(false);
      setRematchStatus(false);
      setTotal(81 - data.base.length);
      setInfoText(`${opponentScore} / ${total}`);
      sound("GameStarted");
    });

    game_conn.on("redirect", (data, newCode) => {
      router.push(`/sudoku/${newCode}`);
      setGameCode(newCode);
      setOpponentScore(0);
      setRematchStatus(false);
      setResult(null);
      setBaseIndex(data.base);
      setBoardData(createBoard(data.board));
      setTotal(81 - data.base.length);
      setInfoText(`${opponentScore} / ${total}`);
    });

    game_conn.on("filled", (operation) => {
      if (operation == "add") {
        setOpponentScore((state) => state + 1);
      } else if (operation == "subtract") {
        setOpponentScore((state) => state - 1);
      }
    });

    game_conn.on("winner", (result) => {
      setResult(result);
      setInfoText(`You ${result}!`);
    });

    game_conn.on("chat", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    game_conn.on("err", (message) => {
      setError(message);
    });

    setSocket(game_conn);

    return () => {
      game_conn.disconnect();
    };
  }, [rematch, router.isReady, loading, gameCode]);

  if (result == "win") {
    scoreText = (
      <div className={boardStyles["rematch-container"]}>
        <ControlButton
          handleClick={() => handleRematch()}
          name={"Rematch"}
          class_on={"rematch-button active"}
          class_off={"rematch-button inactive"}
        />
      </div>
    );
  } else if (result == "lose") {
    scoreText = (
      <div className={boardStyles["rematch-container"]}>
        <ControlButton
          handleClick={() => handleRematch()}
          name={"Rematch"}
          class_on={"rematch-button active"}
          class_off={"rematch-button inactive"}
        />
      </div>
    );
  }

  //Injects meta data so that linking to the site will show the game details
  if (gameDetails) {
    head = (
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content={"Click the link to join"} />

        <meta
          name="og:title"
          content={`Sudoku Challenge from ${gameDetails.host} - ${gameDetails.difficulty} difficulty`}
        />
        <meta name="og:site_name" content={"Playholdr"} />
        <meta name="og:description" content={"Click the link to join"} />
      </Head>
    );
  } else {
    return (
      <div className={boardStyles["board-top-container"]}>
        <Error errorMessage={error} />
      </div>
    );
  }

  //Shows the invite screen
  if (waiting) {
    return (
      <Waiting
        code={gameCode}
        options={options}
        player_total={playerTotal}
        player_count={playerCount}
      >
        {head}
      </Waiting>
    );
  }

  return (
    <div className={boardStyles["board-top-container"]}>
      {head}
      <Board
        key={boardData}
        handleInput={handleInput}
        handleAnnotate={handleAnnotate}
        handleReset={handleReset}
        board={boardData}
        base={baseIndex}
        waiting={false}
      />

      {scoreText}
      <div className={styles["chat-top-container"]}>
        <div className={styles["opponent-container"]}>
          <div className={styles["user-info"]}>
            <div className="user">
              <span className={styles["name"]}>
                {opponent == null ? "Guest" : opponent.username}
              </span>
              <span className={styles["opponent-score"]}>{infoText}</span>
            </div>
          </div>
        </div>
        <div className={styles["chat-container"]}>
          <Chatbox messages={messages} />
          <form onSubmit={(e) => handleChatSubmit(e)}>
            <input
              className={styles["chat-input"]}
              onSubmit={(e) => handleChatSubmit(e)}
              placeholder="Start typing here..."
              value={chatInput}
              onChange={(e) => handleChatInput(e)}
            ></input>
            <input type="submit" style={{ display: "none" }}></input>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sudoku;
