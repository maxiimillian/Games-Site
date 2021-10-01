import { useState } from "react";

function GameLobbies() {
    const [games, setGames] = useState([]);

    return (
        <div className="games-container">
            {games.map(game => {
                return (
                    <div className="game-container">
                        <span className="game-host">{game.host}</span>
                        <span className="game-type">{game.type}</span>
                        <div className="game-players-container">
                            <span className="game-playercount">{game.players.length}</span>
                            <span className="game-playercount">/</span>
                            <span className="game-playercount">{game.player_limit}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}