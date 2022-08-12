import styles from "../../styles/errorbox.module.scss";
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ErrorBox({ message }) {
    return (
        <div className={styles["error-box"]}>
            <FontAwesomeIcon icon={faExclamation} size="lg" />
            <span>{message}</span>
        </div>
    )
}

export default ErrorBox;