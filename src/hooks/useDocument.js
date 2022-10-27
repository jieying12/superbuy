import { useEffect, useState } from "react"
import { db } from "../firebase/firebase-config"

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = db.collection(collection).doc(id)

    const unsubscribe = ref.onSnapshot(snapshot => {
      if(snapshot.data()) {
        setDocument({...snapshot.data(), id: snapshot.id})
        setError(null)
      }
      else {
        setError('Document not found')
      }
    }, err => {
      console.log(err.message)
      setError('cannot fetch doc')
    })

    return () => unsubscribe()

  }, [collection, id])

  return { document, error }
}