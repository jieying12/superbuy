import React, { useState, useRef, useLayoutEffect } from "react"
import { FiShoppingBag, FiSearch } from "react-icons/fi"
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai"
import { Link } from "react-router-dom"

import Countdown from 'react-countdown';

export default function GroupbuyListings({ groupbuys }) {

  const [openImage, setOpenImage] = useState(false)
  const [img, setImg] = useState("")
  const onOpenImage = (src) => {
    setImg(src)
    setOpenImage(true)
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
      <div className='product_items'>
        {groupbuys.map((gb) => (
          <div className='box' key={gb.id}>
            <div className='createdBy' style={{ display: "flex", marginBottom: "5px" }}>
              <img src="https://biographymask.com/wp-content/uploads/2019/12/Kennedy-Claire-Walsh-1200x1200.jpg" style={{ borderRadius: "50%", width: "30px" }} />
              &nbsp;&nbsp;&nbsp;
              <h5 style={{ paddingTop: "2px" }}>{gb.createdBy.displayName}</h5>
            </div>
            <div className='img'>
              <Link to={`/groupbuys/${gb.id}`}>
                <img src={gb.urls[0]} alt='' />
              </Link>
              <div className='overlay'>
                <button className='button' >
                  <FiShoppingBag />
                </button>
                <button className='button'>
                  <AiOutlineHeart />
                </button>
                <button className='button' onClick={() => onOpenImage(gb.urls[0])}>
                  <FiSearch />
                </button>
              </div>
            </div>
            <div className='details'>
              <h2>{gb.title}</h2>
              {new Date(gb.deadline.seconds * 1000) > Date.now() ?
                <h5 style={{ color: "#12b15b" }}>{Math.floor(Math.random() * gb.min)} / {gb.min} people joined</h5> :
                <h5 style={{ color: "#12b15b" }}>{Math.floor(Math.random() * gb.min + 1)} / {gb.min} people joined</h5>
              }
              <br />
            </div>
            <div className='secondRow' style={{ display: "flex", justifyContent: "space-between" }}>
              <div className='countdown' style={{ color: "#6f57b4", backgroundColor: "#e8ecef", width: "130px", height: "25px", borderRadius: "10px" }} >
                &nbsp;&nbsp;&nbsp;
                <Countdown date={new Date(gb.deadline.seconds * 1000).toString()} renderer={renderCountdown} />
              </div>
              <div className='profiePictures' >
                <img src="https://media1.popsugar-assets.com/files/thumbor/Y4xoOEuTx97XZOh3P4sakypY5B8/0x279:2000x2279/fit-in/1024x1024/filters:format_auto-!!-:strip_icc-!!-/2020/12/18/009/n/1922153/16d13f855fdd37ce4da135.92210954_/i/emma-chamberlain-beauty-habits-interview.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                <img src="https://pbs.twimg.com/profile_images/1504538399054589980/GZVQy57T_400x400.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                <img src="https://i.pinimg.com/originals/16/65/8f/16658f6ce7abb4e63bf86258ac0c3234.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                <img src="https://img.i-scmp.com/cdn-cgi/image/fit=contain,width=425,format=auto/sites/default/files/styles/768x768/public/d8/images/methode/2020/04/08/3f16d442-7893-11ea-9479-e3cad17ef2b4_image_hires_144138.jpg?itok=971eTPg6&v=1586328105" style={{ borderRadius: "50%", width: "30px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={openImage ? "modelOpen" : "modelClose"}>
        <div className='onClickImage'>
          <img src={img} alt='' />
          <button className='button' onClick={() => setOpenImage(false)}>
            <AiOutlineClose />
          </button>
        </div>
      </div>
    </>
  )
}
