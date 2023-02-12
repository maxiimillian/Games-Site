import getConfig from "next/config";
import useAuth from "../contexts/authContext";

export const fetchSupporters = () => {
  const { publicRuntimeConfig } = getConfig();
  console.log(3, "FETCHING SUPPORTERS?: ", publicRuntimeConfig, process.env)
  const supportersPromise = fetcher(
    `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/meta/supporters`
  );

  return wrapPromise(supportersPromise);
};

const fetcher = async (url) => {
  try {
    return await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let json = response.json();
        return json;
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    throw err;
  }
};

export function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}
