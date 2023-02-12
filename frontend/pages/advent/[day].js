import styles from "../../styles/advent.module.scss";
import { useState, useEffect } from "react";
import AdventDay from "../../components/advent/AdventDay";

export async function getServerSideProps(context) {
  let link = `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/advent/picture/${context.query.day}`;

  return {
    props: {
      link: link,
    },
  };
}

function AdventPicture(props) {
  const [tags, setTags] = useState([]);

  return (
    <div className={styles["advent-big-picture-container"]}>
      <img
        className={styles["advent-big-picture"]}
        src={props.link}
        alt="could not load image"
      ></img>
    </div>
  );
}

export default AdventPicture;
