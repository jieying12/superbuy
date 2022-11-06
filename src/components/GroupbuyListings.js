import React, { useState, useRef, useLayoutEffect } from "react"
import { FiShoppingBag, FiSearch } from "react-icons/fi"
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai"
import { Link } from "react-router-dom"

import Countdown from 'react-countdown'

import lizProfilePicture from "../views/profile/liz.png"

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
              {gb.createdBy.displayName == "Liz" ?
                <img src={lizProfilePicture} style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Kennedy Walsh" ?
                <img src="https://biographymask.com/wp-content/uploads/2019/12/Kennedy-Claire-Walsh-1200x1200.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Loretta Thompson" ?
                <img src="https://yt3.ggpht.com/ytc/AMLnZu_R7OHlxhxQJxTSzhmEWim_rW-TdutJTDsFRnMi5A=s900-c-k-c0x00ffffff-no-rj" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Daisy Murray" ?
                <img src="https://media1.popsugar-assets.com/files/thumbor/Iv8QJBArT2P5LPX-pL4v9Rjy2xw/877x0:4216x3339/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2019/08/21/839/n/1922564/4eb991e35d5d96c66a2353.98246159_/i/Claudia-Sulewski-Nordstrom-Collection-2019.jpg" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Kendall Jenkins" ?
                <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gettyimages-1340149118.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=640:*" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Wanda Mendoza" ?
                <img src="https://cdn.vox-cdn.com/thumbor/I80tbBk9Xze9rPFoPQA_qXhLFLg=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22358071/ham1280_106_comp_v020_20210112_r709_bf65ee9c.jpeg" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Brandon Keech" ?
                <img src="https://cms-assets.tutsplus.com/uploads/users/810/profiles/19338/profileImage/profile-square-extra-small.png" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
              {gb.createdBy.displayName == "Thomas Shelby" ?
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw3NjA4Mjc3NHx8ZW58MHx8fHw%3D&w=1000&q=80" style={{ borderRadius: "50%", width: "30px" }} />
                : null
              }
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
              <div className='basket_values' style={{ display: "flex", justifyContent: "space-between" }}>
                <h5 style={{ color: "#12b15b" }}>Basket Value: ${Math.floor(Math.random() * gb.min)}</h5>
                <h5 style={{ color: "#12b15b" }}>Basket Min: ${gb.min}</h5>
              </div>
            </div>
            <div className='basket_values' style={{ display: "flex", paddingTop: "8px", paddingBottom: "10px" }}>
              <AiOutlineHeart onClick={() => alert('like')} /> <h6>&nbsp;{Math.floor(Math.random() * 40)} likes</h6>
            </div>
            <div className='secondRow' style={{ display: "flex", justifyContent: "space-between" }}>
              <div className='countdown' style={{ color: "#5539a8", backgroundColor: "#e8ecef", width: "130px", height: "25px", borderRadius: "10px" }} >
                &nbsp;&nbsp;&nbsp;
                <Countdown date={new Date(gb.deadline.seconds * 1000).toString()} renderer={renderCountdown} />
              </div>
              <div className='groupBuyMembers' >
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
