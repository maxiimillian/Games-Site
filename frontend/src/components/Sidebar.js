import { useContext } from "react";

import "../styles/sidebar.scss";
import { faCog, faIdBadge, faGamepad } from '@fortawesome/free-solid-svg-icons';

import { userContext } from "../contexts/userContext";

import { Link } from "react-router-dom";
import SidebarOption from "./SidebarOption";


function Sidebar() {
    let user = useContext(userContext)

    
    return (
        <div className="left-container">
            <div className="main-user-info">
                {Object.keys(user).length != 0 ? 
                    <div class="main-user-container">
                        <img class="main-user-profile" src={user.img_url}></img>
                        <span class="main-user-name">{user.username}</span>
                    </div>
                    :
                    <div class="main-user-container">
                        <h3><Link class="main-user-name" to="login">Sign In</Link></h3>
                    </div>
                }


            </div>
            <div className="left-top-container">
                <div class="main-user-info">

                </div>
                <div className="left-subcontainer">
                    <div class="left-options-container">
                            <SidebarOption title={"Play"} icon={faGamepad}/>
                            <SidebarOption title={"Profile"} icon={faIdBadge}/>
                            <SidebarOption title={"Settings"} icon={faCog}/>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;