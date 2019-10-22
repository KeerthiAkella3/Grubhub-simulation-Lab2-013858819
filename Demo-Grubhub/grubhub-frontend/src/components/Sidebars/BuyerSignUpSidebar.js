import React, { Component } from 'react'

class BuyerSignUpSidebar extends Component {
    render() {
        return (
            <div className="NavSideBar" id="Navigation-Side-Bar">
                <ul className="account-nav-items">
                    <li className="account-nav-items-item h6">
                        <a href="/" className="mainNavBrand-logo">GRUBHUB</a>
                    </li>
                    <br />
                    <li className="account-nav-items-item h6">
                        <a href="/" className="navLink active"><span>Account Info</span></a>
                    </li>
                    <li className="account-nav-items-item h6">
                        <a href="/" className="navLink active"><span>Pricing</span></a>
                    </li>
                    <li className="account-nav-items-item h6">
                        <a href="/" className="navLink active"><span>Tax Info</span></a>
                    </li>
                    <li className="account-nav-items-item h6">
                        <a href="/" className="navLink active"><span>Accept Terms</span></a>
                    </li>
                    <li className="account-nav-items-item h6">
                        <a href="/" className="navLink active"><span>Account Info</span></a>
                    </li>
                    <br />
                    <br />
                    <p className="account-nav-items-item h6">
                        <p className="navInactiveLink active">Need help ?</p>
                        <p className="navInactiveLink active">Email:</p>
                        <a className="navAlwaysActiveLink active" href="moreorders@grubhub.com">moreorders@grubhub.com</a>
                        <p className="navInactiveLink active">Phone:</p>
                        <a href="877-805-5081" className="navLink active">877-805-5081</a>
                        <p className="navAlwaysActiveLink active">9am - 5pm CST; Mon-Fri</p>
                    </p>
                </ul>
            </div>
        )
    }
}

export default BuyerSignUpSidebar
