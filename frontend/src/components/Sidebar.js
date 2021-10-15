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
                    <div className="main-user-container">
                        <img className="main-user-profile" src={user.img_url}></img>
                        <span className="main-user-name">{user.username}</span>
                    </div>
                    :
                    <div className="main-user-container">
                        <h3><Link className="main-user-name" to="login">Sign In</Link></h3>
                    </div>
                }


            </div>
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
        </div>
    )
}

export default Sidebar;