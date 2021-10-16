import "../styles/sidebar.scss";
import { faCog, faIdBadge, faGamepad } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";
import SidebarOption from "./SidebarOption";


function Sidebar() {
    
    return (
            <div className="left-top-container">
                <div className="main-user-info">

                </div>
                <div className="left-subcontainer">
                    <div className="left-options-container">
                            <SidebarOption title={"Play"} icon={faGamepad}/>
                            <SidebarOption title={"Profile"} icon={faIdBadge}/>
                            <SidebarOption title={"Settings"} icon={faCog}/>
                        </div>
                </div>
            </div>

    )
}

export default Sidebar;