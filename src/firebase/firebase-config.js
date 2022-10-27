import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCBa_qqhLkDMyKHQGhMd7fCGf0ludhEZn4",
    authDomain: "superbuy-7e36a.firebaseapp.com",
    projectId: "superbuy-7e36a",
    storageBucket: "superbuy-7e36a.appspot.com",
    messagingSenderId: "409251068249",
    appId: "1:409251068249:web:9a49be232e1a87ffacf448"
  };

  // initialize firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

const timestamp = firebase.firestore.Timestamp

export {db, auth, timestamp, storage}