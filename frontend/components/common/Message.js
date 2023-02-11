import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/chatbox.module.scss";

function Message({ user, content, author }) {
  return (
    <div className={styles["message-container"]}>
      {author ? (
        <FontAwesomeIcon
          fixedWidth
          style={{ padding: "0px 5px", color: "#A8BD92" }}
          icon={faArrowRight}
        />
      ) : null}
      <span className={styles["chat-user"]}>{user}</span>
      <span className={styles["message"]}>{content}</span>
    </div>
  );
}

export default Message;
