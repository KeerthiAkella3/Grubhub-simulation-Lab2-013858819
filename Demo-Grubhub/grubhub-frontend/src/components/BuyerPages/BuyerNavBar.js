import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import GrubHubForRestaurants from '../../images/grubhub-full-logo.svg'
import { ButtonGroup } from 'rsuite'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Icon } from 'rsuite'
import { Redirect } from 'react-router-dom'
import { IconButton } from 'rsuite'

class BuyerNavBar extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            redirectPageName : undefined, 
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleBuyerProfile = this.handleBuyerProfile.bind(this);
        this.handleOrderStatus = this.handleOrderStatus.bind(this);
    }

    handleLogout = () => {
        localStorage.clear();
        console.log("All cookies removed!");
        window.location = "/";
    }

    handleHome = () => {
        if (this.props.disableHome !== undefined && this.props.disableHome === true) {
            console.log('User is already in manage Home page');
        } else {
            this.setState({
                redirectPageName: "/BuyerHomePage"
            })
        }
    }

    handleBuyerProfile = () => {
        if (this.props.disableProfile !== undefined && this.props.disableProfile === true) {
            console.log('User is already in manage profile page');
        } else {
            this.setState({
                redirectPageName: "/BuyerProfilePage"
            })
        }
    }

    handleOrderStatus = () => {
        if (this.props.disableOrderStatus !== undefined && this.props.disableOrderStatus === true) {
            console.log('User is already in order status page');
        } else {
            this.setState({
                redirectPageName: "/BuyerOrderPage"
            })
        }
    }
    
    render() {
        if (this.state.redirectPageName !== undefined) {
            return <Redirect 
                    to={{
                        pathname: this.state.redirectPageName,
                    }} 
                />
        }

        return (
            <Navbar expand="lg" style={{
                    paddingLeft: "25px",
                    paddingTop: "20px",
                    paddingRight: "0%",
                    marginLeft: "0%",
                    marginRight: "0%",
                    marginBottom: "0%",
                    height: "61px",
                    boxShadow: "0 0 0 1px rgba(67,41,163,.1), 0 1px 8px 0 rgba(67,41,163,.1)",
                    backgroundColor: "white",
                    zIndex: "2",
                }}>
                    <Container style={{
                        width: '100%',
                        heigth: '100%',
                        marginLeft: '0%',
                        paddingLeft: '0%',
                        maxWidth: '100%',
                    }}>
                        <Row style={{
                            height: '50px',
                            width: '100%',
                        }}>
                            <Col sm={11}>
                                <a className="mainNavBrand-logo" title="GRUBHUB" href="/" style={{
                                    width: "100%",
                                    height: "inherit"
                                }}>
                                    <img useMap="#" src={GrubHubForRestaurants} className="authentication-view__header__image" alt="GH Restaurant" style={{
                                        width: "100px",
                                        heigth: "50px",
                                    }} />
                                </a>
                            </Col>
                            <Col sm={0} style={{
                                alighItems: 'flex-end',
                            }}>
                                <ButtonGroup horizontal="true">
                                    <IconButton circle={true} onClick={this.handleHome} title="Home" className="btn btn-outline-secondary" icon={<Icon icon="home" />} />
                                    <IconButton circle={true} onClick={this.handleOrderStatus} title="Order Status" className="btn btn-outline-secondary" icon={<Icon icon="first-order" />} />
                                    <IconButton circle={true} onClick={this.handleBuyerProfile} title="Manage Profile" className="btn btn-outline-secondary" icon={<Icon icon="user" />} />
                                    <IconButton circle={true} onClick={this.handleLogout} title="Logout" className="btn btn-outline-secondary" icon={<Icon icon="sign-out" />} />
                                </ButtonGroup>

                            </Col>
                        </Row>
                    </Container>
                </Navbar>
        )
    }
}

export default BuyerNavBar
