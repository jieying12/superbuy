import React from 'react'
import Navbar from '../../components/Navbar'
import './checkout.css'
import CheckoutInformation from './CheckoutInformation'
import CheckoutCart from './CheckoutCart'

function Checkout() {
    return (
        <div> 
            <Navbar />
            <h1 style={{ paddingLeft:'250px', paddingTop: '20px', paddingBottom: '20px'}}>Review and confirm your order</h1>
            <div class="checkout-container">
                <CheckoutInformation />
                <CheckoutCart />
            </div>
        </div>
    )
}

export default Checkout