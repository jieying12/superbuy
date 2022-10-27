import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB2LSZLV6rRzFcgudxh0C3XYjHUQF0XECg",
  authDomain: "super-buy-9f485.firebaseapp.com",
  projectId: "super-buy-9f485",
  storageBucket: "super-buy-9f485.appspot.com",
  messagingSenderId: "589973684992",
  appId: "1:589973684992:web:cc8b7300d13175ca3ca9e5"
};

  // initialize firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

const timestamp = firebase.firestore.Timestamp

export {db, auth, timestamp, storage}