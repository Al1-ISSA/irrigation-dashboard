import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgC_xGkfDd2S6PH5LL00dK73GnUWVIrhg",
  authDomain: "iot-project-4cdd3.firebaseapp.com",
  projectId: "iot-project-4cdd3",
  storageBucket: "iot-project-4cdd3.appspot.com",
  messagingSenderId: "502097348313",
  appId: "1:502097348313:web:4614f2d0ad0973ef9c20c8",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth };
