import sudoku_logo from "../public/sudoku_board.png";
import poker_logo from "../public/poker.png";
import "../../styles/gameoption.module.scss";

function Option({ change_option }) {
    function handleClick(clicked_option) {
        change_option(clicked_option);
    }
    return (
    <div className={styles["options-container"]}>
        <div onClick={() => handleClick("sudoku")} className={styles["game-option"]}>
            <img className={styles["game-icon"]} src={sudoku_logo}></img>
            <span className={styles["game-name"]}>Sudoku</span>
        </div>
        <div onClick={() => handleClick("poker")}  className={styles["game-option"]}>
            <img className={styles["game-icon"]}src={poker_logo}></img>
            <span className={styles["game-name"]}>Poker</span>
        </div>
    </div>
    )
}

export default Option