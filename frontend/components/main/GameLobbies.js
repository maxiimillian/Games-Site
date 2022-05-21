import { useState } from "react";

function GameLobbies() {
    const [games, setGames] = useState([]);

    return (
        <div className={styles["games-container"]}>
            {games.map(game => {
                return (
                    <div className={styles["game-container"]}>
                        <span className={styles["game-host"]}>{game.host}</span>
                        <span className={styles["game-type"]}>{game.type}</span>
                        <div className={styles["game-players-container"]}>
                            <span className={styles["game-playercount"]}>{game.players.length}</span>
                            <span className={styles["game-playercount"]}>/</span>
                            <span className={styles["game-playercount"]}>{game.player_limit}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}