import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7kez3Yc-0si02v4UM1tAKmED52vvieYg",
  authDomain: "healthmd-e1303.firebaseapp.com",
  projectId: "healthmd-e1303",
  storageBucket: "healthmd-e1303.appspot.com",
  messagingSenderId: "1054186559192",
  appId: "1:1054186559192:web:f7e3e447ab3f3c862169ad",
  measurementId: "G-BBLW93D0TF"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
export const storage = getStorage(app)
