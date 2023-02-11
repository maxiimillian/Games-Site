import Message from "./Message";
import styles from "../../styles/chatbox.module.scss";

function Chatbox({ messages }) {
  let numbers = 0;

  return (
    <div className={styles["chat-messages"]}>
      <ul className={styles["messages-container"]}>
        {messages
          .slice(0)
          .reverse()
          .map((message) => {
            numbers = numbers + 1;
            return (
              <li className={styles["message-item"]}>
                <Message
                  key={numbers}
                  user={message.user}
                  content={message.content}
                  author={message.author}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Chatbox;
