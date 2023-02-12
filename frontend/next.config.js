console.log(1, process.env.NEXT_PUBLIC_API_URL);
module.exports = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  testing: () => {
    console.log(2, process.env.NEXT_PUBLIC_API_URL);
  }
};
