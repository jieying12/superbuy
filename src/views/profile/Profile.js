import React from 'react'
import Navbar from '../../components/Navbar'
import CreatedListings from './CreatedListings'
import Dashboard from './Dashboard'
import './profile.css'

function Profile() {
    return (
        <>
            <Navbar />
            <div className='profile-container'>
                <Dashboard />
                <CreatedListings />
            </div>
        </>
    )
}

export default Profile