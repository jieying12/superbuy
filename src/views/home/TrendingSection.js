import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from "react"
import { db } from "../../firebase/firebase-config"

import { Heading } from "../../components/Heading"
import GroupbuyListings from '../../components/GroupbuyListings'
import InContainerLoading from '../../components/InContainerLoading'

export default function TrendingSection() {
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

  if (!groupbuys) {
    return <InContainerLoading />
  }

  return (
    <>
      <section className='product'>
        <div className='container'>
          <Heading title='Trendings Products' desc='Check out our popular groupbuys' />

          {groupbuys && <GroupbuyListings groupbuys={groupbuys} />}
        </div>
      </section>
    </>
  )
}