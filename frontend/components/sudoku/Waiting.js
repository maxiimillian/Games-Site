import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faClipboard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { activateClipboard, useFocus } from "../../util";
import CancelButton from "../buttons/CancelButton";
import styles from "../../styles/waiting.module.scss";

function Waiting(props) {
    const [wasClicked, setWasClicked] = useState(false);
    const [inviteInput, setInputFocus] = useFocus();

    function formatOptions(details) {
        console.log(props)
        let optionsList = [];
                
        optionsList.push(`Player Count: ${details.players} players`)
        optionsList.push(`Time: ${details.time} minutes`)
        optionsList.push(`Difficulty: ${details.difficulty}`)

        return optionsList;
    }

    function generateOptionsList(options) {
        console.log("OPTIONS: ", props)
        return options.map(option => {
            return <li className={styles["waiting-option"]}>{option}</li>
        })
    }

    function copyInput(e) {
        setWasClicked(true);
        setInputFocus();
        activateClipboard(inviteInput.current.value);
    }

    return (
        <div className={styles["box waiting-container"]}>
            <div className={styles["waiting-subcontainer"]}>
                <div className={styles["waiting-header"]}>
                    <h1>{props.code}</h1>
                    <FontAwesomeIcon className={styles["left-option-icon"]} icon={faUserFriends} fixedWidth/>
                    <span className={styles["waiting-player-count"]}>{props.player_count}/{props.player_total}</span>
                </div>
                <ul>
                    {generateOptionsList(formatOptions(props.options))}
                </ul>
                <p>Send this link to a friend to start playing!</p>
                <div className={styles["input-container"]}>
                    <input className={styles["invite-input"]} ref={inviteInput} value={`https://playholdr.com/sudoku/${props.code}`} readonly></input>
                    <FontAwesomeIcon onClick={(e) => copyInput(e)} className={styles["clipboard hover-pointer"]} size="2x" icon={wasClicked ? faClipboardCheck : faClipboard} fixedWidth/>
                </div>
                <div className={styles["cancel-container"]}>
                    <CancelButton />
                </div>
            </div>
        </div>
    )
}

export default Waiting;