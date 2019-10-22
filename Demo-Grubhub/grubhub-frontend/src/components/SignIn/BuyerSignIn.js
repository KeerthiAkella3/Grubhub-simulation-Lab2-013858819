import React, { Component } from 'react'
import { connect } from 'react-redux';
import BuyerSignInForm from '../SignIn/BuyerSignInForm'



export class BuyerSignIn extends Component {
    render() {
        console.log(this.props);
        return (
            <div>
                <BuyerSignInForm />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        SignedUpFlag: state.user.authFlag,
        username: state.user.emailId
    }
}

export default connect(mapStateToProps)(BuyerSignIn);
