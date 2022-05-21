import Table from "../poker/Table";
import { useState } from "react";
import Image from "next/image";

import styles from "../../styles/gameoption.module.scss";


import { faCog, faIdBadge, faGamepad } from '@fortawesome/free-solid-svg-icons'

import Username from "../common/Username";
import ControlButtonIcon from '../common/ControlButtonIcon';
import CreationForm from "../common/CreationForm";
import Blockpage from "../common/Blockpage";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




function CenterControl(props) {
    const VALID_OPTIONS = ["options", "poker", "sudoku"];
    const [option, setOption] = useState(props.option);
    const [difficulty, setDifficulty] = useState("easy");
    const [isLogin, setLogin] = useState(false);
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
            <div>
                <Blockpage handleClick={() => changeOption("options")} />
                <CreationForm />  
            </div>
        )
    }   

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <Username className={styles["home-username"]}/>
            <div className={styles["options-sidebar-container"]}>

                <div className={styles["options-container"]}>
                    
                        <section onClick={() => changeOption("sudoku")} className={styles["game-option"]}>
                            <Image src="/poker.png" className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
                            <span className={styles["game-name"]}>Sudoku</span>
                        </section>
                        <section onClick={() => changeOption("poker")}  className={styles["game-option"]}>
                            <Image src="/poker.png" className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
                            <span className={styles["game-name"]}>Poker</span>
                        </section>
                        <section onClick={() => changeOption("poker")}  className={styles["game-option"]}>
                            <Image src="/sudoku_board.png" className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
                            <span className={styles["game-name"]}>Crossword</span>
                        </section>
                        <section onClick={() => changeOption("poker")}  className={styles["game-option"]}>
                            <Image src="/poker.png" className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
                            <span className={styles["game-name"]}>Tic-Tac-Toe</span>
                        </section>
                        <section onClick={() => changeOption("poker")}  className={styles["game-option"]}>
                            <Image src="/poker.png" className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
                            <span className={styles["game-name"]}>Blackjack</span>
                        </section>
                        <section onClick={() => changeOption("poker")}  className={styles["game-option"]}>
                            <Image src="/poker.png" className={styles["game-icon"]} height="150" width="200" alt="sudoku board" />
                            <span className={styles["game-name"]}>Clue</span>
                        </section>
                </div>
                <div className={styles["sidebar-container"]}>
                    <ControlButtonIcon 
                        class_on={"settings-button on"} 
                        class_off={"settings-button off"}
                        icon={<FontAwesomeIcon size="2x" icon={faCog}/>} />

                    <ControlButtonIcon 
                        class_on={"settings-button on"} 
                        class_off={"settings-button off"}
                        icon={<FontAwesomeIcon size="2x" icon={faIdBadge}/>} />
                </div>
            </div>

            {center}
        </div>
    )
}

export default CenterControl