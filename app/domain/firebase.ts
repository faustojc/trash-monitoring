import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import 'firebase/compat/auth';
import {getStorage} from "firebase/storage";

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

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseStorage = getStorage(firebaseApp);
