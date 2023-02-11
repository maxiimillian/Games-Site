import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/gamecreator.module.scss";

function SudokuForm(props) {
  const [time, setTime] = useState(5);
  const [players, setPlayers] = useState(2);
  const [difficulty, setDifficulty] = useState("easy");
  const router = useRouter();

  function createGame(e) {
    e.preventDefault();
    let difficulty = e.target.difficulty.value;
    let time = e.target.time.value;
    let playerCount = e.target.players.value;

    let payload = {
      difficulty: difficulty,
      time: time,
      playerCount: playerCount,
      auth: localStorage.getItem("token"),
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sudoku/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        router.push(`/sudoku/${data.code}`);
      });
  }

  return (
    <section className={styles["create-container"]} id="game-menu">
      <form className={styles["create-form"]} onSubmit={(e) => createGame(e)}>
        <div className={styles["create-form-header"]}>
          <h1>Game Settings</h1>
        </div>

        <div className={styles["create-form-center"]}>
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            name="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="extreme">Extreme</option>
            <option value="test">Test</option>
          </select>
        </div>
        <div
          className={`${styles["create-form-center"]} ${styles["create-form-column"]}`}
        >
          <label htmlFor="time">
            Time: <b>{time}</b>
          </label>
          <input
            type="range"
            name="time"
            value={time}
            min="1"
            max="30"
            onChange={(e) => setTime(e.target.value)}
          ></input>
        </div>
        <div
          className={`${styles["create-form-center"]} ${styles["create-form-column"]}`}
        >
          <label htmlFor="players">
            Players: <b>{players}</b>
          </label>
          <input
            type="range"
            name="players"
            value={players}
            min="1"
            max="4"
            onChange={(e) => setPlayers(e.target.value)}
          ></input>
        </div>
        <button type="submit" className="submit">
          Create Game
        </button>
      </form>
    </section>
  );
}

export default SudokuForm;
