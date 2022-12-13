import styles from "../../styles/advent.module.scss";
import { useState, useEffect } from "react";
import AdventDay from "../../components/advent/AdventDay";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();


function AdventPage(props) {
    const [tags, setTags] = useState([]);
    let days = Array.from({length: 31}, (_, i) => i + 1);
    return (
        <div>
            <h1 className={styles["advent-title"]}>Advent Calandar 2022</h1>
            <div className={styles["calender"]}>
                
                {days.map(day => {
                    return <AdventDay key={day} number={day} link={`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/advent/picture/${day}`} />
                })}
            </div>
        </div>
    )
}

export default AdventPage;