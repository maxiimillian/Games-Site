import Icon from "../common/Icon";
import styles from "../../styles/header.module.scss";
import Link from 'next/link';

function Header() {

    return (
        <header>
            <Icon width={"80px"} height={"62px"}/>
            <nav>
                <span className={styles["header-button"]}><Link href="/">Play</Link></span>
                <span className={styles["header-button"]}><Link href="/forum">Forum</Link></span>
                <span className={styles["header-button"]}>Blog</span>
                <span className={styles["header-button"]}>Support</span>
            </nav>
        </header>
    )
}


export default Header;