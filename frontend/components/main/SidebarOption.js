import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../styles/sidebar.module.scss";

function SidebarOption({ title, icon }) {
  return (
    <div className={styles["left-option"]}>
      <div className={styles["word-icon"]}>
        <span>{title}</span>
        <FontAwesomeIcon
          className={styles["left-option-icon"]}
          icon={icon}
          fixedWidth
        />
      </div>
    </div>
  );
}

export default SidebarOption;
