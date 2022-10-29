import { useState, useEffect } from 'react'
import { auth } from '../firebase/firebase-config'
import { useAuthContext } from './useAuthContext'

import { db, timestamp } from "../firebase/firebase-config"

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, username) => {
    setError(null)
    setIsPending(true)
  
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Failed registration')
      }

      await res.user.updateProfile({ username })
      //create user on firestore
      const userRef = db.collection('users').doc(res.user.uid)
      const addedUser = await userRef.set(
        {
          uid: res.user.uid,
          displayName: username,
          email,
          photoURL: '',
          createdAt: timestamp.fromDate(new Date())
        });

      //create empty user chats on firestore
      const chatRef = db.collection('userChats').doc(res.user.uid)
      const addedChat = await chatRef.set({});

      dispatch({ type: 'LOGIN', data: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}