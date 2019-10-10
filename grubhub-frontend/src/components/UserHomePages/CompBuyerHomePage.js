import React, { Component } from 'react'
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar'
import CompBuyerProfileForm from '../Profiles/CompBuyerSignUpForm'
import CompOwnerSidebar from '../Sidebars/CompOwnerSidebar'

export class CompBuyerHomePage extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
                <Sidebar
                    sidebar={<CompOwnerSidebar />}
                    docked="true"
                    styles={
                        { sidebar: { background: "black" } }
                    }
                    children={<CompBuyerProfileForm />}
                >
                </Sidebar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authFlag: state.user.authFlag,
        username: state.user.username
    }
}

export default connect(mapStateToProps)(BuyerHomePage);
