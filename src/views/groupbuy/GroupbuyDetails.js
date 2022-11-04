import { useParams, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { ChatContext } from "../../context/ChatContext";
import { db, timestamp } from "../../firebase/firebase-config"
import firebase from "firebase/app"

import { v4 as uuid } from "uuid";
import { MdStarRate } from "react-icons/md"

import Navbar from '../../components/Navbar'

export default function GroupbuyDetails() {
  const { user } = useAuthContext() // buyer
  const { dispatch } = useContext(ChatContext);

  const { id } = useParams()
  const { document, error } = useDocument('groupbuys', id)
  const navigate = useNavigate()

  const handleTest = async () => {
    navigate('/chat')
  }
  const handleChat = async () => {
    const hostId = document.createdBy.id
    const hostUsername = document.createdBy.displayName
    const combinedId =
    user.uid > hostId
        ? user.uid + hostId
        : hostId + user.uid;
    try {
      const res = await db.collection("chats").doc(combinedId).get()

      //check whether private chat exists, if not create
      if (!res.exists) {
        //create a chat in chats collection
        await db.collection('chats').doc(combinedId).set({ messages: [] });
        //create user chats
        const buyerChatRef = db.collection('userChats').doc(user.uid)
        await buyerChatRef.update({
          [combinedId + ".userInfo"]: {
            uid: hostId,
            displayName: hostUsername,
            photoURL: '',
          },
          [combinedId + ".date"]: timestamp.fromDate(new Date()),
        });

        const hostChatRef = db.collection('userChats').doc(hostId)
        await hostChatRef.update({
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: 'buyer',
            photoURL: '',
          },
          [combinedId + ".date"]: timestamp.fromDate(new Date()),
        });
        } 

          // buyer's view
          dispatch({ type: "CHANGE_USER", payload: {
            uid: hostId,
            displayName: hostUsername,
            photoURL: '',
          } });
          navigate('/chat')

      } catch(err) {
          console.log("Saving chat error:", err);
      }
  };


  const handleRequest = async () => {
    const hostId = document.createdBy.id
    const hostUsername = document.createdBy.displayName
    const combinedId =
    user.uid > hostId
        ? user.uid + hostId
        : hostId + user.uid;
    try {
      const res = await db.collection("chats").doc(combinedId).get()

      //check whether private chat exists, if not create
      if (!res.exists) {
        //create a chat in chats collection
        await db.collection('chats').doc(combinedId).set({ messages: [] });
        // create request
        const orderRef = db.collection('orders')
        const addedOrder = await orderRef.add(
          {
            buyerId: user.uid,
            buyerDisplayName: 'buyer',
            buyerEmail: user.email,
            hostId: hostId,
            groupBuyId: id,
            chatId: combinedId,
            productName: 'HIGH NECK HIGH SUPPORT SPORTS BRA',
            productUrl: 'https://eu.gymshark.com/products/gymshark-high-neck-high-support-sports-bra-iguana-green-aw22',
            requestDetails: 'SIZE M, QTY X 2',
            status: 'PENDING_APPROVAL',
            createdAt: timestamp.fromDate(new Date())
          });

          await db.collection('chats').doc(combinedId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                id: uuid(),
                text: user.displayName + ' has sent you a request for your ' + document.title + ' group buy.',
                senderId: user.uid,
                isRequest: true,
                isAcceptance: false,
                orderId: addedOrder.id,
                groupBuyId: id,
                date: timestamp.fromDate(new Date()),
            }),
        });

        //create user chats
        const buyerChatRef = db.collection('userChats').doc(user.uid)
        await buyerChatRef.update({
          [combinedId + ".userInfo"]: {
            uid: hostId,
            displayName: hostUsername,
            photoURL: '',
          },
          [combinedId + ".lastMessage"]: {
            text: 'You have sent a request for ' + document.title + ' group buy by' + user.displayName + '.',
          },
          [combinedId + ".date"]: timestamp.fromDate(new Date()),
        });

        const hostChatRef = db.collection('userChats').doc(hostId)
        await hostChatRef.update({
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: 'buyer',
            photoURL: '',
          },
          [combinedId + ".lastMessage"]: {
            text: user.displayName + ' has sent you a request for your ' + document.title + ' group buy.',
          },
          [combinedId + ".date"]: timestamp.fromDate(new Date()),
        });

      } 
        dispatch({ type: "CHANGE_USER", payload: {
          uid: hostId,
          displayName: hostUsername,
          photoURL: '',
        } });
        navigate('/chat')
      } catch(err) {
          console.log("Saving chat error:", err);
      }
  };

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
                  <button className='button' onClick={() => handleTest()}>
                    Request
                  </button>
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