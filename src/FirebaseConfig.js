import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvwLMuvCVgmXP7co2HQJvLL9ZTR-RMbxA",
    authDomain: "web-chat-69695.firebaseapp.com",
    projectId: "web-chat-69695",
    storageBucket: "web-chat-69695.appspot.com",
    messagingSenderId: "749953708945",
    appId: "1:749953708945:web:d3d7c4fe7d7aa6db322030",
    measurementId: "G-C68H580BDC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;