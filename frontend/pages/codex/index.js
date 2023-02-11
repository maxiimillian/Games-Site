import styles from "../../styles/codex.module.scss";
import { useState, useEffect } from "react";
import getConfig from "next/config";
import { fetchForumPosts } from "../../api/fetching";
const { publicRuntimeConfig } = getConfig();

function CodexPage(props) {
  return (
    <div className={styles["codex-page-container"]}>
      <div className={styles["codex-container"]}></div>
    </div>
  );
}

export default CodexPage;
