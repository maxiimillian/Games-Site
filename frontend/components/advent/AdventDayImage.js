import { useState } from "react";
import styles from "../../styles/advent.module.scss";
import Link from "next/link";

function AdventDayImage(props) {
  const [showImage, setShowImage] = useState(false);

  return (
    <div className={styles["day-image-container"]}>
      <img
        className={styles["day-image"]}
        src={props.link}
        alt="could not get image"
      ></img>
      <Link href={`/advent/${props.number}`}>
        <span className={styles["day-expand"]}>Expand</span>
      </Link>
    </div>
  );
}

export default AdventDayImage;
