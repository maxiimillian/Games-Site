import "../../styles/sidebar.scss";
import { faCog, faIdBadge, faGamepad } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";
import SidebarOption from "./SidebarOption";

import logo from '../../public/logo.png';

function Sidebar() {
    
    return (
            <div className="left-top-container">
                <div className="left-container">
                    <div className="logo-container">
                        <Link to="/"><img className="logo" width="30%" src={logo} alt="website icon"></img></Link>
                    </div>
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