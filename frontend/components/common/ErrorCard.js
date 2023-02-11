import styles from "../../styles/errorcard.module.scss";

function ErrorCard(props) {
  return (
    <div className={styles["error-card"]}>
      <strong>Error</strong>
      <span>{props.errorMessage}</span>
    </div>
  );
}

export default ErrorCard;
