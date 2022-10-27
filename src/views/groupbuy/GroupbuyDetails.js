import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'

import { MdStarRate } from "react-icons/md"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"

import Navbar from '../../components/Navbar'

export default function GroupbuyDetails() {
  const { id } = useParams()
  const { document, error } = useDocument('groupbuys', id)

  if (error) {
    return <div className="error">{error}</div>
  }
  if (!document) {
    return <div className="loading">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <article>
        <section className='details'>
          <h2 className='details_title'>Groupbuy Details Pages</h2>
            <div className='details_content'>
              <div className='details_content_img'>
                <img src={document.urls[0]} alt='' />
              </div>
              <div className='details_content_detail'>
                <h1>{document.title}</h1>
                <div className='rating'>
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <MdStarRate />
                  <label htmlFor=''>(1 customer review)</label>
                </div>
                <h3> $ XXX </h3>
                <p>{document.createdBy.displayName}</p>
                <div className='qty'>
                  <button className='button'>Request</button>
                </div>
                <div className='desc'>
                  <h4>PRODUCTS DESCRIPTION</h4>
                  <p>{document.description}</p>
                  <h4> PRODUCT DETAILS</h4>
                  <ul>
                    <li>
                      <p> Category: {document.category}</p>
                    </li>
                    <li>
                      <p>Service Fee: ${document.fee}</p>
                    </li>
                    <li>
                      <p>Est. Shipping Fee: ${document.shipping}</p>
                    </li>
                    <li>
                      <p>Min. no. of Buyers: {document.min}</p>
                    </li>
                    <li>
                      <p>Deadline: {new Date(document.deadline._seconds * 1000).toLocaleDateString("en-US")}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
        </section>
      </article>
    </>
  )
}