import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/sidebar.scss";

function SidebarOption({ title, icon }) {
    return (
        <div class="left-option">
            <div class="word-icon">
                <span>{title}</span>    
                <FontAwesomeIcon className="left-option-icon" icon={icon} fixedWidth/>
            </div>
        </div>
    )
}

export default SidebarOption;