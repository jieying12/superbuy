import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from "react"
import { db } from "../../firebase/firebase-config"

import { Heading } from "../../components/Heading"
import GroupbuyListings from './GroupbuyListings'

export default function GroubuySection() {
  const { user } = useAuthContext()
  const [groupbuys, setGroupbuys] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ref = db.collection('groupbuys')
    // ref = ref.where("uid", "==", user.uid)
    // ref = ref.orderBy('createdAt', 'desc')

    const unsubscribe = ref.onSnapshot(snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      });

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
      <section className='product'>
        <div className='container'>
          <Heading title='Products you might like'/>

          {groupbuys && <GroupbuyListings groupbuys={groupbuys} />}
        </div>
      </section>
    </>
  )
}