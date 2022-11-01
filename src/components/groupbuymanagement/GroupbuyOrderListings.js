import React from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from "react"
import { db } from "../../firebase/firebase-config"

export default function GroupbuyOrderListings() {
  const { user } = useAuthContext()
  const [groupbuys, setGroupbuys] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {

    let ref = db.collection('groupbuys')
    ref = ref.where("createdBy.id", "==", user.uid)

    const unsubscribe = ref.onSnapshot(snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      });
      console.log(results)
      setGroupbuys(results)
      setError(null)
    }, error => {
      console.log(error)
      setError('groupbuys failed to be fetched')
    })

    return () => unsubscribe()

  }, [])
  return (
    <>
      testing
    </>
  )
}
