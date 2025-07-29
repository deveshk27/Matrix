import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAEubKiRqY5KkJfwL6wHZnOjl8m5Swy68",
  authDomain: "matrix-f2b76.firebaseapp.com",
  projectId: "matrix-f2b76",
  storageBucket: "matrix-f2b76.firebasestorage.app",
  messagingSenderId: "1009173630547",
  appId: "1:1009173630547:web:537a4f3d1429fa851380a6",
  measurementId: "G-BNZ5SY00ZR"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);