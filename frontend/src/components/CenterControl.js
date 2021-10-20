import Table from "./Table";
import Options from "./Options";
import Board from "./Board";
import { useState } from "react";
import data from "./test.json";
import { Link } from "react-router-dom";
import sudoku_logo from "../public/sudoku_board.png";
import poker_logo from "../public/poker.png";




function CenterControl(props) {
    const VALID_OPTIONS = ["options", "poker", "sudoku"]
    const [option, setOption] = useState(props.option)
    const [difficulty, setDifficulty] = useState("easy")
    let center;

    if (!VALID_OPTIONS.includes(option)) setOption("options");

    function handleDifficulty(e) {
        setDifficulty(e.target.value);
    }

    function changeOption(newOption) {
        if (VALID_OPTIONS.includes(newOption)) {
            setOption(newOption);
        }
    }
    
    if (option == "poker") {
        center = <Table />
    } else if (option == "sudoku") {
        center = (
            <div class="block-container">
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
            </div>
        )
    }   

    return (
        <div>
            <div className="options-container">
                    <section onClick={() => changeOption("sudoku")} className="game-option">
                        <img className="game-icon" src={sudoku_logo}></img>
                        <span className="game-name">Sudoku</span>
                    </section>
                    <section onClick={() => changeOption("poker")}  className="game-option">
                        <img className="game-icon"src={poker_logo}></img>
                        <span className="game-name">Poker</span>
                    </section>
            </div>
            {center}
        </div>
    )
}

export default CenterControl