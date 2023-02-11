import { useState } from "react";
import Image from "next/image";
import styles from "../../styles/gameoption.module.scss";
import Username from "../common/Username";
import Blockpage from "../common/Blockpage";
import gameIndex from "../../gameIndex";

function CenterControl(props) {
  const [currentForm, setCurrentForm] = useState(null);
  let center;

  if (currentForm != null) {
    center = (
      <div className="form-block-container">
        <Blockpage handleClick={() => setCurrentForm(null)} />
        {currentForm.render()}
      </div>
    );
  }

  return (
    <div className="game_option-container">
      <Username className={styles["home-username"]} />
      <div className={styles["options-sidebar-container"]}>
        <div className={styles["options-container"]}>
          {gameIndex.map((game) => {
            return (
              <section
                key={game.name}
                onClick={() => setCurrentForm(game)}
                className={styles["game-option"]}
              >
                <Image
                  src={game.imagePath}
                  className={styles["game-icon"]}
                  height="150"
                  width="200"
                  alt="sudoku board"
                />
                <span className={styles["game-name"]}>{game.name}</span>
              </section>
            );
          })}
        </div>
      </div>

      {center}
    </div>
  );
}

export default CenterControl;
