import { useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/gamecreator.module.scss";

function ComingSoonForm(props) {
  return (
    <section className={styles["create-container"]} id="game-menu">
      <h1>Coming Soon</h1>
    </section>
  );
}

export default ComingSoonForm;
