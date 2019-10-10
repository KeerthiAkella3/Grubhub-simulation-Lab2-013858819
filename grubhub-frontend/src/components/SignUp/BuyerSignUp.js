import React, { Component } from 'react'
import Sidebar from 'react-sidebar'
import BuyerProfileForm from '../Profiles/BuyerSignUpForm'
import BuyerHomePage from'../Profiles/BuyerProfilePage'
import BuyerSignUpSidebar from '../Sidebars/BuyerSignUpSidebar'

export class BuyerSignUp extends Component {
    render() {
        return (
            <div>

                <BuyerProfileForm/>
                <BuyerHomePage/>
            </div>
        );
    }
}

export default BuyerSignUp
