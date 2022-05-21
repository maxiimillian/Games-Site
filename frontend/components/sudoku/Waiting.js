import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends, faClipboard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { activateClipboard, useFocus } from "../../util";
import CancelButton from "../buttons/CancelButton";
import "../../styles/waiting.module.scss";

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
            return <li class="waiting-option">{option}</li>
        })
    }

    function copyInput(e) {
        setWasClicked(true);
        setInputFocus();
        activateClipboard(inviteInput.current.value);
    }

    return (
        <div class="box waiting-container">
            <div class="waiting-subcontainer">
                <div class="waiting-header">
                    <h1>{props.code}</h1>
                    <FontAwesomeIcon className="left-option-icon" icon={faUserFriends} fixedWidth/>
                    <span class="waiting-player-count">{props.player_count}/{props.player_total}</span>
                </div>
                <ul>
                    {generateOptionsList(formatOptions(props.options))}
                </ul>
                <p>Send this link to a friend to start playing!</p>
                <div class="input-container">
                    <input className="invite-input" ref={inviteInput} value={`https://playholdr.com/sudoku/${props.code}`} readonly></input>
                    <FontAwesomeIcon onClick={(e) => copyInput(e)} className="clipboard hover-pointer" size="2x" icon={wasClicked ? faClipboardCheck : faClipboard} fixedWidth/>
                </div>
                <div class="cancel-container">
                    <CancelButton />
                </div>
            </div>
        </div>
    )
}

export default Waiting;