import { useState, useEffect } from 'react'
import { auth } from '../firebase/firebase-config'
import { useAuthContext } from './useAuthContext'

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