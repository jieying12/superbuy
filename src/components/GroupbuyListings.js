import React, { useState } from "react"
import { FiShoppingBag, FiSearch } from "react-icons/fi"
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai"
import { Link } from "react-router-dom"

export default function GroupbuyListings({ groupbuys }) {

  const [openImage, setOpenImage] = useState(false)
  const [img, setImg] = useState("")
  const onOpenImage = (src) => {
    setImg(src)
    setOpenImage(true)
  }

  return (
    <>
      <div className='product_items'>
        {groupbuys.map((gb) => (
          <div className='box' key={gb.id}>
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
              <h3>{gb.title}</h3>
              <p>{gb.min}</p>
              <h4>${gb.fee}</h4>
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
