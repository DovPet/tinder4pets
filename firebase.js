// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB99BAv7KT74JDyu0Yl9gWR7_j7glUll_w",
  authDomain: "tinder4pets-5ff77.firebaseapp.com",
  projectId: "tinder4pets-5ff77",
  storageBucket: "tinder4pets-5ff77.appspot.com",
  messagingSenderId: "798263319209",
  appId: "1:798263319209:web:af302871e1823c00b4e7b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export { auth, db }