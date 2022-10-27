import React from 'react'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"
import { useLogout } from '../hooks/useLogout'
import Logo from '../assets/logo.png'
import { BiSearch } from "react-icons/bi"
import { BsBagCheck } from "react-icons/bs"
import { RiUser3Line } from "react-icons/ri"
import { AiOutlineHeart, AiOutlineMenu, AiOutlineClose, AiOutlineDelete } from "react-icons/ai"

export default function Navbar() {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const history = useNavigate();

  return (
    <>
      <header className='header'>
        <div className='container'>
          <nav>
            <div className='left'>
              <Link to='/'>
                <img src={Logo} alt='logo' />
              </Link>
            </div>
            <div className='center'>
              <ul className='menu'>
                <li><Link to="/login">Products</Link></li>
                <li><Link to="/signup">Orders</Link></li>
                <li><Link to="/signup">Groups</Link></li>
              </ul>
            </div>
          </nav>
          <div className='right'>
            <div className='right_search'>
              <input type='text' placeholder='Search Products...' />
              <BiSearch className='serachIcon heIcon' />
            </div>
            <div className='right_user'>
              <RiUser3Line className='userIcon heIcon' />
              <AiOutlineHeart className='userIcon heIcon' />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}