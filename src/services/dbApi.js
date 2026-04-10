import axios from "axios";

const firebaseURL = process.env.REACT_APP_FIREBASE_DB_URL;

if (!firebaseURL) {
  throw new Error("Firebase DB URL missing");
}

const api = axios.create({
  baseURL: firebaseURL,
  timeout: 15000,
});

const buildPath = (path) =>
  `${path.replace(/^\/+/, "").replace(/\.json$/, "")}.json`;

const handleRequest = async (request) => {
  try {
    const res = await request();
    return res.data;
  } catch (err) {
    console.error("DB error:", err);

    throw new Error(
      err?.response?.data?.error || err?.message || "Database request failed",
    );
  }
};

export const dbApi = {
  get: (path) => handleRequest(() => api.get(buildPath(path))),
  post: (path, data) => handleRequest(() => api.post(buildPath(path), data)),
  put: (path, data) => handleRequest(() => api.put(buildPath(path), data)),
  patch: (path, data) => handleRequest(() => api.patch(buildPath(path), data)),
  remove: (path) => handleRequest(() => api.delete(buildPath(path))),
};
