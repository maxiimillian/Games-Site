import getConfig from 'next/config';
import useAuth from "../contexts/authContext";
const { publicRuntimeConfig } = getConfig();
export const fetchSupporters = () => {
  const supportersPromise = fetcher(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/meta/supporters`);
  return wrapPromise(supportersPromise);
}

//Params should be an object, api will accept values for sortBy, direction, tags, and query
export const fetchForumPosts = (params) => {
    const postsPromise = fetcher(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/meta/forum/posts?` + new URLSearchParams(params))
    return wrapPromise(postsPromise);
}
  

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
