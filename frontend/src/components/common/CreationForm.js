import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import "../../styles/gamecreator.scss";

function CreationForm(props) {
    const [time, setTime] = useState(5);
    const [players, setPlayers] = useState(2);
    const [difficulty, setDifficulty] = useState("easy");

    let history = useHistory();

    function createGame(e) {
        e.preventDefault();
        let difficulty = e.target.difficulty.value;
        let time = e.target.time.value;
        let playerCount = e.target.players.value;

        let payload = {
            "difficulty": difficulty,
            "time": time,
            "player_count": playerCount,
            "auth": localStorage.getItem("token"),
        }
        
        fetch(`${process.env.REACT_APP_API_URL}/sudoku/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            history.push(`/sudoku/${data.code}`);
        });

    }

    return (
        <div>
            <section className="create-container" id="game-menu">
                <form className="create-form" onSubmit={(e) => createGame(e)}>
                    <div className="create-form-header">
                        <h1>Game Settings</h1>
                    </div>

                    <div className="create-form-center">
                        <label htmlFor="difficulty">Difficulty:</label>
                        <select name="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="extreme">Extreme</option>
                            <option value="test">Test</option>
                        </select>
                    </div>
                    <div className="create-form-center create-form-column">
                        <label htmlFor="time">Time: <b>{time}</b></label>
                        <input type="range" name="time" value={time} min="1" max="30" onChange={(e) => setTime(e.target.value)}></input>
                    </div>
                    <div className="create-form-center create-form-column">
                        <label htmlFor="players">Players: <b>{players}</b></label>
                        <input type="range" name="players" value={players} min="1" max="4" onChange={(e) => setPlayers(e.target.value)}></input>
                    </div>
                    <button type="submit" className="create-form-submit">Create Game</button>
                </form>
            </section>
        </div>
    )
}

export default CreationForm;

/* <div className="block-container">
                <div className="create-container">
                    <div style={{dispaly: "flex", flexDirection: "column"}}>
                        <h2>Create Game</h2>
                        <select value={difficulty} onChange={(e) => handleDifficulty(e)} className="create-selector">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                            <option>Extreme</option>
                            <option>Test</option>
                        </select>
                        <Link to={`/sudoku/create/?create=true&difficulty=${difficulty}`}><button>Create</button></Link>
                    </div>
                </div>
            </div>*/