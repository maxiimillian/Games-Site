import { useState } from "react";

function ControlButton(props) {
    const [status, setStatus] = useState(false);

    function handleClickChild() {
        setStatus(!status)
        props.handleClick();
    }

    return (
        <button onClick={() => handleClickChild()} className={status ? props.class_on : props.class_off} >
            <span className="control-button-text">{props.name}</span>
        </button>
    )
}

ControlButton.defaultProps = {
    class_on: "control-button on",
    class_off: "control-button off", 
}

export default ControlButton;