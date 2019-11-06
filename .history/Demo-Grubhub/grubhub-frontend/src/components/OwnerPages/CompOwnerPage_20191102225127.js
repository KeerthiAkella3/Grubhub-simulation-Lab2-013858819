import React, { Component } from 'react'
import SideNavInstance from '../Sidebars/SideNavInstance'
import MenuPage from './MenuPage';
import OrderPage from './OrderPage';
import ProfilePage from './ProfilePage';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import cookie from 'react-cookies';
import 'bootstrap/dist/css/bootstrap.min.css';



export class CompOwnerPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pageName: "Orders",
            restaurantId: undefined,
        }
        this.handleSideBarSelect = this.handleSideBarSelect.bind(this);
        this.rerenderPage = this.rerenderPage.bind(this);
    }


    componentDidMount = () => {
        this.setState({
            restaurantId: cookie.load('cookie3'),
        })
    }

    handleSideBarSelect = (pageName) => {
        if (pageName === "Orders") {
            this.setState({
                pageName: "Orders"
            })
        } else if (pageName === "Menu") {
            this.setState({
                pageName: "Menu"
            })

        } else if (pageName === "Profile") {
            this.setState({
                pageName: "Profile"
            })

        }
    }

    rerenderPage = (e, pageName) => {
        console.log("Refreshing Owner's Home Page");
        console.log(pageName);
        this.setState({
            pageName: pageName,
        })
    }

    render() {
        // console.log('owner home page state');
        // console.log(this.state);
        const isOrdersPage = (this.state.pageName === "Orders");
        const isMenuPage = (this.state.pageName === "Menu");
        const isProfilePage = (this.state.pageName === "Profile");
        let activeKey = "1";
        let restaurantId = cookie.load('cookie2');
        let page = <OrderPage refreshPage={this.rerenderPage} restaurantId={restaurantId}/>;
        if (isOrdersPage) {
            activeKey = "2";
            page = <OrderPage refreshPage={this.rerenderPage} restaurantId={restaurantId}/>;
        } else if (isMenuPage) {
            activeKey = "3";
            page = <MenuPage refreshPage={this.rerenderPage} restaurantId={restaurantId}/>;
        } else if (isProfilePage) {
            activeKey = "4";
            page = <ProfilePage refreshPage={this.rerenderPage} restaurantId={restaurantId}/>;
        }


        let grubhubRow = {
            display: "flex",
            flexWrap: "wrap",
            marginLeft: "0%",
            marginRight: "0%",
            paddingLeft: "0%",
            paddingRight: "0%",
            height: "100%",
        };
        
        let mainPageCol = {
            flexBasis: "0",
            flexGrow: "1",
            maxWidth: "100%",
            marginLeft: "0%",
            marginRight: "0%",
            paddingLeft: "0%",
            paddingRight: "0%",
            height: "100%",
        }

        let sideBarCol = {
            flexBasis: "0",
            flexGrow: "1",
            maxWidth: "250px",
            marginLeft: "0%",
            marginRight: "0%",
            paddingLeft: "0%",
            paddingRight: "0%",
            height: "100%",
        }
        
        let grubhubContainer = {
            width: "100%",
            padding: "0%",
            marginLeft: "0%",
            marginRight: "0%",
            paddingRight: "0%",
            paddingLeft: "0%",
            height: "100%",
        }

        let ownerPageDiv = {
            width: "100%",
            height: "100%",
        }
        // console.log("Rendering page with ");
        // console.log('activekey = ' + activeKey);
        // console.log(page);
        return (
            <div style={ownerPageDiv}>
                <div style={grubhubContainer}>
                    <Row style={grubhubRow}>
                        <Col style={sideBarCol}><SideNavInstance onOptionClick={this.handleSideBarSelect} defaultActiveKey = {activeKey} /> </Col>
                        {/* Based on what user clicks in sidebar, we need to display appropriate component. Default is Orders page */}
                        <Col className={mainPageCol}>{page}</Col>
                    </Row>
                </div>
            </div>

        )
    }
}

export default CompOwnerPage
