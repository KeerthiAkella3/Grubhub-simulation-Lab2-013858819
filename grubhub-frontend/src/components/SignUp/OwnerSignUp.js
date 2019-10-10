import React, { Component } from 'react'
import Sidebar from 'react-sidebar'
import OwnerProfileForm from '../Profiles/OwnerProfilePage'
import BuyerSignUpSidebar from '../Sidebars/BuyerSignUpSidebar'

export class OwnerSignUp extends Component {
    render() {
        return (
            <div>
                <OwnerProfileForm/>
            </div>
        );
    }
}

export default OwnerSignUp
