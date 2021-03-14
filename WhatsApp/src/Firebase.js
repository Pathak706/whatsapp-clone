import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3u7ECbqLdGRZz5S0j3X8cYuon31xpNC4",
  authDomain: "whatsapp-c9698.firebaseapp.com",
  projectId: "whatsapp-c9698",
  storageBucket: "whatsapp-c9698.appspot.com",
  messagingSenderId: "342218144992",
  appId: "1:342218144992:web:4ba0f07d8d3c765674a485",
  measurementId: "G-E1L2LQEXCC"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.analytics();
  const storage = firebase.storage()

  export{ auth, provider, storage, firebase };
  export default db;