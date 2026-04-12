import axios from "axios";

const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const authURL = "https://identitytoolkit.googleapis.com/v1/accounts";

export const signUpUser = async (email, password) => {
  const res = await axios.post(`${authURL}:signUp?key=${API_KEY}`, {
    email,
    password,
    returnSecureToken: true,
  });

  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${authURL}:signInWithPassword?key=${API_KEY}`, {
    email,
    password,
    returnSecureToken: true,
  });

  return res.data;
};
