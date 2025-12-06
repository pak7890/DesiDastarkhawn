import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDrtYmOGj2UUQmqGstjfs6FbxxNWmijmBo",
  authDomain: "desi-dastarkhawn.firebaseapp.com",
  projectId: "desi-dastarkhawn",
  storageBucket: "desi-dastarkhawn.firebasestorage.app",
  messagingSenderId: "1030891657316",
  appId: "1:1030891657316:web:90d0d78df9324bb0dfe771",
  measurementId: "G-R0JYGPCE50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };