import { useState } from "react";
import { Link } from "react-router-dom";

import "../../styles/gamecreator.scss";

function CreationForm(props) {
    const [time, setTime] = useState(5);
    const [players, setPlayers] = useState(2);

    return (
        <div>
            <section class="create-container" id="game-menu">
                <form class="create-form" method="post" action={`${process.env.REACT_APP_API_URL}/sudoku/create?create=true`}>
                    <div class="create-form-header">
                        <h1>Game Settings</h1>
                    </div>
                    <div class="create-form-center">
                        <label for="difficulty">Difficulty:</label>
                        <select name="difficulty">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="extreme">Extreme</option>
                        </select>
                    </div>
                    <div class="create-form-center create-form-column">
                        <label for="time">Time: <b>{time}</b></label>
                        <input type="range" name="time" value={time} min="1" max="30" onChange={(e) => setTime(e.target.value)}></input>
                    </div>
                    <div class="create-form-center create-form-column">
                        <label for="players">Players: <b>{players}</b></label>
                        <input type="range" name="players" value={players} min="1" max="4" onChange={(e) => setPlayers(e.target.value)}></input>
                    </div>
                    <Link to={`/sudoku/create/?create=true&difficulty=${difficulty}`}><button type="submit" class="create-form-submit">Create Game</button></Link>
                </form>
            </section>
        </div>
    )
}

export default CreationForm;

/* <div class="block-container">
                <div class="create-container">
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