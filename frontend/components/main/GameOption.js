import sudoku_logo from "../public/sudoku_board.png";
import poker_logo from "../public/poker.png";
import "../../styles/gameoption.module.scss";

function GameOption() {
    function handleClick() {
        props.handleClick(props.form);
    }
    return (
        <section onClick={() => handleClick} className={styles["game-option"]}>
            <Image src={props.imagePath} className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
            <span className={styles["game-name"]}>{props.name}</span>
        </section>
    )
}

export default GameOption;