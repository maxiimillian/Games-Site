import Icon from "../common/Icon";
import styles from "../../styles/header.module.scss";

function Header() {

    return (
        <header>
            <Icon width={"80px"} height={"62px"}/>
            <nav>
                <span className={styles["header-button"]}>Play</span>
                <span className={styles["header-button"]}>Forum</span>
                <span className={styles["header-button"]}>Blog</span>
                <span className={styles["header-button"]}>Support</span>
            </nav>
        </header>
    )
}


export default Header;