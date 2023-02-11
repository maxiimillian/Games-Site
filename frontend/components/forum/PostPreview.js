import styles from "../../styles/forum.module.scss";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function formatText(text, maxLength) {
  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + "...";
  }

  return text;
}

function parseDate(dateString) {
  const currentDate = new Date();
  const postedDate = new Date(dateString);
  const time = new Map([
    [86400000, "Day"],
    [3600000, "Hour"],
    [60000, "Minute"],
    [1000, "Second"],
  ]);
  const difference = currentDate - postedDate;

  for (let [key, value] of time) {
    let amount = Math.floor(difference / key);
    if (amount == 1) {
      return `${amount} ${value}`;
    } else if (amount > 1) {
      return `${amount} ${value}s`;
    }
  }
}
/**
 * Research best practice and if its a good idea to be making components
 * that render a list of another component i.e. Posts.js rendering out all the Post.js
 * components.
 */
function PostPreview(props) {
  return (
    <div className={styles["post-container"]}>
      <div className={styles["post-subcontainer"]}>
        <div className={styles["post-header"]}>
          <span className={styles["post-date"]}>
            {parseDate(props.date)} ago
          </span>
          <span className={styles["post-title"]}>
            {formatText(props.title, 100)}
          </span>
        </div>
        <div className={styles["post-footer"]}>
          <div className={styles["post-button-container"]}>
            <span className={styles["reply-count"]}>{props.votes}</span>
            <span className={styles["reply-count"]}>{props.replyCount}</span>
          </div>
          <div className={styles["post-button-container"]}>
            <FontAwesomeIcon
              className={styles["post-buttons"]}
              icon={faThumbsUp}
              size="md"
            />
            <FontAwesomeIcon
              className={styles["post-buttons"]}
              icon={faCommentAlt}
              size="md"
            />
          </div>
        </div>
      </div>
      {props.tags.map((tag) => {
        return <span className={styles["create-tag"]}>{tag}</span>;
      })}
    </div>
  );
}

export default PostPreview;
