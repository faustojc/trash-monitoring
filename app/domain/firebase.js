import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC86XBdtq-SuRwZ7CSSJQ5viTd_sybg4ek",
    authDomain: "thesis-raspi.firebaseapp.com",
    databaseURL: "https://thesis-raspi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thesis-raspi",
    storageBucket: "thesis-raspi.appspot.com",
    messagingSenderId: "154991516906",
    appId: "1:154991516906:web:67db4d7dafa98658a14b93",
    measurementId: "G-VQFKY3E7P3"
};

const app = initializeApp(firebaseConfig);
export const firebaseDatabase = getFirestore(app);
export const firebaseAuth = getAuth(app)
