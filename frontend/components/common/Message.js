import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import styles from "../../styles/chatbox.module.scss";

function Message(props) {
    return (
        <div className={styles["message-container"]}>
            {props.author ? <FontAwesomeIcon fixedWidth style={{padding: "0px 5px", color: "#A8BD92"}} icon={faArrowRight} /> : null}
            <span className={styles["chat-user"]}>{props.user}</span>
            <span className={styles["message"]}>{props.content}</span>
        </div>
    )
}

export default Message;