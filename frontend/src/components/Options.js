import sudoku_logo from "../public/sudoku_board.png";
import poker_logo from "../public/poker.png";

function Option({ change_option }) {
    function handleClick(clicked_option) {
        change_option(clicked_option);
    }
    return (
    <div className="options-container">
        <div onClick={() => handleClick("sudoku")} className="game-option">
            <img className="game-icon" src={sudoku_logo}></img>
            <span className="game-name">Sudoku</span>
        </div>
        <div onClick={() => handleClick("poker")}  className="game-option">
            <img className="game-icon"src={poker_logo}></img>
            <span className="game-name">Poker</span>
        </div>
    </div>
    )
}

export default Option