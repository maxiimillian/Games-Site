import styles from "../../styles/forum.module.scss";

function formatText(text, maxLength) {
    if (text.length > maxLength) {
        text = text.slice(0, maxLength) + "...";
    }

    return text;
}
 m,
/**
 * Research best practice and if its a good idea to be making components
 * that render a list of another component i.e. Posts.js rendering out all the Post.js
 * components.
 */
function PostPreview(props) {
    return (
        <div className={styles["post-container"]}>
            <div className={styles["post-header"]}>
                <span className={styles["post-title"]}>{formatText(props.content, 100)}</span>
                <span className={styles["post-date"]}>{props.date}</span>
            </div>
            <p className={styles["post-content"]}>
                {formatText(props.content, 150)}
            </p>
            <div className={styles["post-footer"]}>
                <span className={styles["reply-count"]}>{props.replyCount}</span>
            </div>
        </div>
    )
}

export default PostPreview;