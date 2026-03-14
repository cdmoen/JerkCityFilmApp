import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDne_meO1stmxys3TJL8zsthukoBfYWxSU",

  authDomain: "test-8103f.firebaseapp.com",

  projectId: "test-8103f",

  storageBucket: "test-8103f.firebasestorage.app",

  messagingSenderId: "440170749495",

  appId: "1:440170749495:web:481950e2f9e8440695e9b2",

  measurementId: "G-JCN3JSMTWS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
