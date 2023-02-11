import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/gamecreator.module.scss";

function CodexForm(props) {
  const [number, setNumber] = useState(1);
  const router = useRouter();

  function goToPage(e) {
    e.preventDefault();
    router.push(`/codex/${number}`);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className={styles["create-container"]} id="game-menu">
      <form className={styles["create-form"]} onSubmit={(e) => goToPage(e)}>
        <div className={styles["create-form-header"]}>
          <h1>Codex Pages</h1>
        </div>

        <div className={styles["create-form-center"]}>
          <label htmlFor="difficulty">Page Number:</label>
          <input
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          ></input>
        </div>

        <button type="submit" className="submit">
          Go to page
        </button>
      </form>
    </section>
  );
}

export default CodexForm;
