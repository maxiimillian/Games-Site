import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CancelButton(props) {
    return(
        <button className="hover-pointer cancel-button">
            <FontAwesomeIcon className="left-option-icon" icon={"fa-solid fa-xmark"} fixedWidth/>
            Cancel
        </button>
    )
}

export default CancelButton;