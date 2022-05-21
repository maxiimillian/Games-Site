//use props.children and make this component the screen wide greyed out thing that goes away when clicked
import styles from "../../styles/blockpage.module.scss";

function Blockpage(props) {
    return (
        <div onClick={props.handleClick} className={styles["block-container"]}>
            {props.children}
        </div>
    )
}

export default Blockpage;