
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDyBQO6n2-wsm6sbtA23M-fdQWD1VuBlQ8",
  authDomain: "zarakistore.firebaseapp.com",
  projectId: "zarakistore",
  storageBucket: "zarakistore.appspot.com",
  messagingSenderId: "585835364085",
  appId: "1:585835364085:web:1e60bfc37a5b2c"
};

// Initialize Firebase

export const firebase = initializeApp(firebaseConfig);