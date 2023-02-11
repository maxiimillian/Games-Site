import { useEffect } from "react";
import { useRouter } from "next/router";

function RedirectForm(props) {
  const router = useRouter();

  useEffect(() => {
    router.push(props.path);
  }, []);

  return null;
}

export default RedirectForm;
