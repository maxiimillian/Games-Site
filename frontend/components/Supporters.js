import { useState, startTransition } from "react";
import styles from "../styles/supporters.module.scss";

import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchSupporters } from "../api/supporters";
import ErrorBox from "./common/ErrorBox";

const resource = fetchSupporters();


function Supporters(props) {
    let supporters = [
        {name: "Loading", type: "Donation", url: "#", date: "3h"},
        {name: "Joe", type: "Feature-dasdsadsd", url: "#", date: "3h"},
        {name: "John", type: "Bug Fix #23", url: "#", date: "3h"},
        {name: "Jack", type: "Feature-New Button", url: "#", date: "3h"},
    ];
    const [supporters2, setSupporters] = useState([
        {name: "Jim", type: "Donation", url: "#", date: "3h"},
        {name: "Joe", type: "Feature-dasdsadsd", url: "#", date: "3h"},
        {name: "John", type: "Bug Fix #23", url: "#", date: "3h"},
        {name: "Jack", type: "Feature-New Button", url: "#", date: "3h"},
    ]);

    try {
        const data = resource.read();
        supporters = data.supporters;    
    } catch (err) {
        console.log(err)
        return (
            <div className="supporters-container">
                <h3>Supporters</h3>
                <ErrorBox message={"Something went wrong"} />
            </div>
        )
    }

    return (
        <section className="supporters-container">
            <h3>Supporters</h3>
            {supporters.map(supporter => {
                return (
                <section className={styles["supporter-container"]}>
                    <div className={styles["supporter-header"]}>
                        <span className={styles["supporter-name"]}>{supporter.name}</span>
                        <span className={styles["supporter-date"]}>{supporter.date}</span>
                    </div>
                    <div className={styles["supporter-link-container"]}>
                        <FontAwesomeIcon className="arrow" icon={faLevelUpAlt} rotation={90} size="lg" />
                        <a href={supporter.url} className={styles["supporter-link"]}><span className="supporter-type">{supporter.type}</span></a>
                    </div>
                </section>)
            })}
        </section>
    )
}

export function Skeleton() {
    const supporters = [{}, {}, {}, {}]
    return (
        <section className="supporters-container">
            <h3>Sspporters</h3>
            {supporters.map(supporter => {
                return (
                <section className={styles["supporter-container"]}>
                    <div className={styles["supporter-header"]}>
                        <span className={styles["supporter-name"]}>Loading</span>
                        <span className={styles["supporter-date"]}>Loading</span>
                    </div>
                    <div className={styles["supporter-link-container"]}>
                        <FontAwesomeIcon className="arrow" icon={faLevelUpAlt} rotation={90} size="lg" />
                        <a href="#" className={styles["supporter-link"]}><span className="supporter-type">Loading</span></a>
                    </div>
                </section>)
            })}
        </section>
    )
}

export default Supporters;