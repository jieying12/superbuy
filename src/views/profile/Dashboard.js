import React from 'react'
import logo from './liz.png'
import './profile.css'

function Dashboard() {
    return (
        <div className="dashboard-container">
            <img className='dp' src={logo} />
            <h1> Liz </h1>
            <p>Buy now, think later </p>
            <p>372 Followers</p>
            <p>29 Following</p>
            <h4>Joined</h4>
            <p>20/10/2021</p>
            <h4>Listings</h4>
            <p>6</p>
            <h4>Sales Revenue</h4>
            <p>$550</p>
            <h4>Loyalty Points</h4>
            <p>120</p>
            <h4>Hosted</h4>
            <p>3 times</p>
            <h4>Reviews</h4>
        </div>
    )
}

export default Dashboard