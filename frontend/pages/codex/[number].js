import styles from "../../styles/codex.module.scss";
import { useEffect, useState } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { publicRuntimeConfig } = getConfig();

export async function getServerSideProps(context) {
  return {
    props: {
      number: context.query.number,
      path: process.env.NEXT_PUBLIC_API_URL,
    },
  };
}

function CodexSuccess(props) {
  const router = useRouter();
  return (
    <div className={styles["codex-success"]}>
      <span>Correct!</span>
      <button
        onClick={(e) => {
          router.push(`/codex/${parseInt(props.number) + 1}`);
          props.resetStatus(null);
        }}
      >
        Next Page <FontAwesomeIcon icon={faArrowRight} size="lg" />
      </button>
    </div>
  );
}

function CodexFailed(props) {
  return <div className={styles["codex-failed"]}>Incorrect!</div>;
}

function CodexNumber(props) {
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(null);
  }, []);

  async function handleClick(e) {
    setStatus(null);
    setGuess("");
    setTimeout(async () => {
      await fetch(`${props.path}/codex/${props.number}?guess=${guess}`).then(
        (resp) => setStatus(resp.status)
      );
    }, 200);
  }

  return (
    <div className={styles["codex-page-container"]}>
      <div suppressHydrationWarning className={styles["codex-container"]}>
        <h1>Codex Page {props.number}</h1>
        <span>Your guess for page {props.number}:</span>
        <input
          placeholder=""
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        ></input>
        <button
          onClick={(e) => handleClick(e)}
          className="submit"
          type="submit"
        >
          Attempt Guess
        </button>

        {status == 200 ? (
          <CodexSuccess resetStatus={setStatus} number={props.number} />
        ) : null}
        {status == 401 ? <CodexFailed /> : null}
      </div>
    </div>
  );
}

export default CodexNumber;
