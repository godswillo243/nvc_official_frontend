const env = {
  VITE_API_KEY: import.meta.env.VITE_API_KEY,
  VITE_API_URL:
    import.meta.env.VITE_API_URL || "https://nvc-api.onrender.com/users/",
};

export default env;
