import { useParams, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { ChatContext } from "../../context/ChatContext";
import { db, timestamp } from "../../firebase/firebase-config"
import firebase from "firebase/app"
import { FiShare } from "react-icons/fi"
import { AiOutlineHeart, AiFillStar } from "react-icons/ai"

import { v4 as uuid } from "uuid";
import { MdStarRate } from "react-icons/md"

import Navbar from '../../components/Navbar'

import Countdown from 'react-countdown'
import ProgressBar from "@ramonak/react-progress-bar"

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
      dispatch({
        type: "CHANGE_USER", payload: {
          uid: hostId,
          displayName: hostUsername,
          photoURL: '',
        }
      });
      navigate('/chat')

    } catch (err) {
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
      dispatch({
        type: "CHANGE_USER", payload: {
          uid: hostId,
          displayName: hostUsername,
          photoURL: '',
        }
      });
      navigate('/chat')
    } catch (err) {
      console.log("Saving chat error:", err);
    }
  };

  if (error) {
    return <div className="error">{error}</div>
  }
  if (!document) {
    return <div className="loading">Loading...</div>
  }

  const renderCountdown = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>Completed</span>
    } else if (days > 0) {
      // Render a countdown
      return <span><b>{days}</b>d <b>{hours}</b>h <b>{minutes}</b>m</span>
    } else {
      return <span><b>{hours}</b>h <b>{minutes}</b>m <b>{seconds}</b>s</span>
    }
  }

  return (
    <>
      <Navbar />
      <article>
        <section className='details'>
          {/* <h2 className='details_title'>Groupbuy Details Pages</h2> */}
          <div className='details_content'>
            <div className='details_content_img'>
              <img src={document.urls[0]} alt='' />
            </div>
            <div className='details_content_detail'>
              <div className='title_and_timer' style={{ display: "flex" }}>
                <h1>{document.title}</h1>
                &nbsp;&nbsp;&nbsp;
                <h1 style={{ color: "#5539a8", backgroundColor: "#e8ecef", width: "220px", height: "45px", borderRadius: "30px" }}>
                  &nbsp;&nbsp;&nbsp;<Countdown date={new Date(document.deadline.seconds * 1000).toString()} renderer={renderCountdown} />
                </h1>
              </div>
              <div className='marketing_feedback' style={{ display: "flex", paddingTop: "10px" }}>
                <button className='button' style={{ width: "80px" }}><FiShare />&nbsp;Share</button>
                &nbsp;&nbsp;&nbsp;
                <button className='button' style={{ width: "90px" }}><AiOutlineHeart />&nbsp;24 Likes</button>
              </div>
              <div className='progress_bar' style={{ paddingTop: "30px", width: "65%" }}>
                <ProgressBar completed={50} bgColor="#00ac4f" height="10px" />
                <div className='progress_bar_details' style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
                  <h2 style={{ color: "#00ac4f" }}>${document.min / 2}</h2>
                  <div className='groupBuyMembers' >
                    <img src="https://media1.popsugar-assets.com/files/thumbor/Y4xoOEuTx97XZOh3P4sakypY5B8/0x279:2000x2279/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2020/12/18/009/n/1922153/16d13f855fdd37ce4da135.92210954_/i/emma-chamberlain-beauty-habits-interview.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                    <img src="https://pbs.twimg.com/profile_images/1504538399054589980/GZVQy57T_400x400.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                    <img src="https://i.pinimg.com/originals/16/65/8f/16658f6ce7abb4e63bf86258ac0c3234.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                    <img src="https://img.i-scmp.com/cdn-cgi/image/fit=contain,width=425,format=auto/sites/default/files/styles/768x768/public/d8/images/methode/2020/04/08/3f16d442-7893-11ea-9479-e3cad17ef2b4_image_hires_144138.jpg?itok=971eTPg6&v=1586328105" style={{ borderRadius: "50%", width: "30px" }} />
                  </div>
                </div>
                <h6>worth of orders made out of ${document.min}</h6>
              </div>
              <div className='product_description' style={{ paddingTop: "30px", width: "65%" }}>
                <h1>Description</h1>
                <p>{document.description}</p>
              </div>
              <div className='collection_details' style={{ display: "flex", justifyContent: "space-between", paddingTop: "30px", width: "65%" }}>
                <div className='meetup'>
                  <h4>Meet-up</h4>
                  <div className='meetup_location' style={{ display: "flex" }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/67/67347.png" style={{ height: "18px", paddingTop: "4px" }} />
                    &nbsp;
                    <h5><a href="https://www.google.com/maps?q=woodlands+mrt&rlz=1C1CHBD_enSG861SG861&um=1&ie=UTF-8&sa=X&ved=2ahUKEwjjyZzE45T7AhXkT2wGHZCXC04Q_AUoAXoECAEQAw">
                      Woodlands MRT
                    </a></h5>
                  </div>
                </div>
                <div className='delivery'>
                  <h4>Delivery</h4>
                  <h5>Basic Package (3-5 days): $1.50</h5>
                  <h5>Registered Mail (2-3 days): $2.50</h5>
                </div>
              </div>
              <div className='host_details' style={{ paddingTop: "30px", display: "flex" }}>
                {document.createdBy.displayName == "Annette Block" ?
                  <img src="https://preview.redd.it/vt8dqyl3rr891.jpg?width=640&crop=smart&auto=webp&s=aab8e036d3ddddb54824f0274851bd136fd35ec5" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Kennedy Walsh" ?
                  <img src="https://biographymask.com/wp-content/uploads/2019/12/Kennedy-Claire-Walsh-1200x1200.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Loretta Thompson" ?
                  <img src="https://yt3.ggpht.com/ytc/AMLnZu_R7OHlxhxQJxTSzhmEWim_rW-TdutJTDsFRnMi5A=s900-c-k-c0x00ffffff-no-rj" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Daisy Murray" ?
                  <img src="https://media1.popsugar-assets.com/files/thumbor/Iv8QJBArT2P5LPX-pL4v9Rjy2xw/877x0:4216x3339/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2019/08/21/839/n/1922564/4eb991e35d5d96c66a2353.98246159_/i/Claudia-Sulewski-Nordstrom-Collection-2019.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Kendall Jenkins" ?
                  <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1340149118.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Wanda Mendoza" ?
                  <img src="https://cdn.vox-cdn.com/thumbor/I80tbBk9Xze9rPFoPQA_qXhLFLg=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22358071/ham1280_106_comp_v020_20210112_r709_bf65ee9c.jpeg" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Brandon Keech" ?
                  <img src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                {document.createdBy.displayName == "Thomas Shelby" ?
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw3NjA4Mjc3NHx8ZW58MHx8fHw%3D&w=1000&q=80" style={{ borderRadius: "50%", width: "30px" }} />
                  : null
                }
                &nbsp;&nbsp;
                <h3>{document.createdBy.displayName}</h3>
              </div>
              <div className='rating'>
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <label htmlFor=''>(23)</label>
              </div>
              <div className='qty'>
                <button className='button' style={{ marginLeft: "-5px" }} onClick={() => handleRequest()}>
                  Request
                </button>
              </div>
              {/* <div className='desc'>
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
              </div> */}
            </div>
          </div>
        </section>
      </article>
    </>
  )
}