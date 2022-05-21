import styles from "../../styles/sidebar.module.scss";
import { faCog, faIdBadge, faGamepad } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SidebarOption from "./SidebarOption";
import Image from "next/image";

function Sidebar() {
    
    return (
            <div className="left-top-container">
                <div className="left-container">
                    <div className="logo-container">
                        <Link href="/"><Image src="/logo.png" className={styles["logo"]} width="30%" height="100%" alt="website icon" /></Link>
                    </div>
                </div>
                <div className={styles["left-subcontainer"]}>
                    <div className={styles["left-options-container"]}>
                            <SidebarOption title={"Play"} icon={faGamepad}/>
                            <SidebarOption title={"Profile"} icon={faIdBadge}/>
                            <SidebarOption title={"Settings"} icon={faCog}/>
                        </div>
                </div>
            </div>

    )
}

export default Sidebar;