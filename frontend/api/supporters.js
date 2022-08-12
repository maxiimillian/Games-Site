import getConfig from 'next/config';
import useAuth from "../contexts/authContext";

export const fetchSupporters = () => {
  const { publicRuntimeConfig } = getConfig();
  const supportersPromise = fetcher(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/meta/supporters`);

  return wrapPromise(supportersPromise);
}

const fetcher = async (url) => {
  console.log("fetch")
  try {
    return await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
          "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .catch((err) => {
      console.log("err2: ", err)
      throw err;
    });
  } catch (err) {
    console.log("err: ", err)
    throw err;
  }
};

export function wrapPromise(promise) {
  let status = 'pending';
  let result;
  let suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      //console.log(status);
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
}
