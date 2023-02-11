import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import styles from "../../styles/gamecreator.module.scss";

function AdventForm(props) {
  const router = useRouter();

  useEffect(() => {
    router.push("/advent/");
  }, []);

  return null;
}

export default AdventForm;
