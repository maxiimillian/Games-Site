import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faClipboard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { activateClipboard, useFocus } from "../../util";
import CancelButton from "../buttons/CancelButton";
import styles from "../../styles/waiting.module.scss";
import sidebarStyles from "../../styles/sidebar.module.scss";


function Waiting(props) {
    const [wasClicked, setWasClicked] = useState(false);
    const [inviteInput, setInputFocus] = useFocus();
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(`http://${window.location.hostname}:3000/sudoku/${props.code}`)
    }, []);

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
            return <li key={option} className={styles["waiting-option"]}>{option}</li>
        })
    }

    function copyInput(e) {
        setWasClicked(true);
        setInputFocus();
        activateClipboard(inviteInput.current.value);
    }

    return (
        <div className={`box ${styles["waiting-container"]}`}>
            <div className={styles["waiting-subcontainer"]}>
                <div className={styles["waiting-header"]}>
                    <h1>{props.code}</h1>
                    <FontAwesomeIcon className={sidebarStyles["left-option-icon"]} icon={faUserFriends} fixedWidth/>
                    <span className={styles["waiting-player-count"]}>{props.player_count}/{props.player_total}</span>
                </div>
                <ul className={styles["waiting-options"]}>
                    {generateOptionsList(formatOptions(props.options))}
                </ul>
                <p>Send this link to a friend to start playing!</p>
                <div className={styles["input-container"]}>
                    <input className={styles["invite-input"]} ref={inviteInput} value={url} readOnly></input>
                    <FontAwesomeIcon onClick={(e) => copyInput(e)} className="clipboard hover-pointer" size="2x" icon={wasClicked ? faClipboardCheck : faClipboard} fixedWidth/>
                </div>
                <div className={styles["cancel-container"]}>
                    <CancelButton />
                </div>
            </div>
        </div>
    )
}

export default Waiting;