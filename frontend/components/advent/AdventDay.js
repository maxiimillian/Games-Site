import { useEffect, useState } from "react";
import styles from "../../styles/advent.module.scss";
import AdventDayImage from "./AdventDayImage"

function AdventDay(props) {
    const [showImage, setShowImage] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        setShowImage(localStorage.getItem(`advent-${props.number}`) || false);
    }, []);
    
    function getDay() {
        let date = new Date()
        return date.getDate();
    }

    function handleClick() {
        console.log(showImage, props.number, getDay())
        if (!showImage && props.number <= getDay()) {
            localStorage.setItem(`advent-${props.number}`, true);
            setShowAnimation(true);
        } else {
            setShowImage(true);
        }
    }

    function handleAnimationEnd() {
        setShowAnimation(false);
        setShowImage(true);
    }

    return(
        <div className={`${styles["day-container"]} ${showAnimation ? styles["open-animation"]: ""}`} onClick={() => handleClick()} onAnimationEnd={() => handleAnimationEnd()}>
            <div className={styles["snow"]}></div>
            {showImage ? <AdventDayImage link={props.link} number={props.number}/>
            :
            <span className={styles["day-number"]}>{props.number}</span>
            }
        </div>
    )
}

export default AdventDay;