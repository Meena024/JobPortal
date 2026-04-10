// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC3S9kNlAcm5LE1DmfEEWl3QCT8MMSFW8",
  authDomain: "react-http-91c04.firebaseapp.com",
  databaseURL: "https://react-http-91c04-default-rtdb.firebaseio.com",
  projectId: "react-http-91c04",
  storageBucket: "react-http-91c04.firebasestorage.app",
  messagingSenderId: "184253049319",
  appId: "1:184253049319:web:a6753448ec548974da3542",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
