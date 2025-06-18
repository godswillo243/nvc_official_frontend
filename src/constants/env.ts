const env = {
  VITE_API_KEY: import.meta.env.VITE_API_KEY||46346179-9a76-494b-ac58-eac75b8327ec,
  VITE_API_URL:
    import.meta.env.VITE_API_URL || "https://nvc-api.onrender.com/users/",
};

export default env;
