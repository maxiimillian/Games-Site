import { React, useState, Component, useEffect } from "react";

export default function Table(props) {
    const [players, setPlayers] = useState([]);
    const [actions, setActions] = useState([]);

    return (
        <div>
            <div className="players-container">
                {players}
            </div>
        </div>
    )
}