import { useState } from "react";
import styles from "../../styles/forum.module.scss";
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Tag(props) {
    const [isActive, setIsActive] = useState(false);

    function handleClick() {
        setIsActive(!isActive);
        props.handleClick(props.name);
    }

    function getStatusClass() {
        return isActive ? styles["create-tag-active"] : styles["create-tag-inactive"]
    }

    return (
        <span className={`${styles["create-tag"]} ${getStatusClass()}`} onClick={() => handleClick()}>
            {isActive ?
            <FontAwesomeIcon className="arrow" icon={faCheck} size="sm" />
            :
            <FontAwesomeIcon className="arrow" icon={faPlus} size="sm" />
            }
            
            {props.name}
        </span>
    )
}

export default Tag;