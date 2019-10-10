import { Icon, Nav, Sidenav } from 'rsuite';
import './Sidebar.css';
import '../../App.css';
import GrubHubForRestaurants from '../../images/grubhub-full-logo.svg'

import React, { Component } from 'react'

export class SideNavInstance extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }

        this.onOrderClickHandler = this.onOrderClickHandler.bind(this)
        this.onProfileClickHandler = this.onProfileClickHandler.bind(this)
        this.onMenuClickHandler = this.onMenuClickHandler.bind(this)
        this.logout = this.logout.bind(this);
    }

    logout = () => {
        localStorage.clear();
        console.log("All cookies removed!");
        window.location = "/";
    }

    onOrderClickHandler = (e) => {
        this.props.onOptionClick("Orders");
    }

    onMenuClickHandler = (e) => {
        this.props.onOptionClick("Menu");
    }

    onProfileClickHandler = (e) => {
        this.props.onOptionClick("Profile");
    }

    render() {
        let sideNavDiv = {
            width: "100%",
            height: "100%",
        }

        return (
            <div style={sideNavDiv}>
                <Sidenav defaultOpenKeys={['3', '4']} activeKey={this.props.defaultActiveKey}>
                    <Sidenav.Body>
                        <Nav>
                            <Nav.Item eventKey="1">
                                <img useMap="#" src={GrubHubForRestaurants} alt="GH Restaurant" style={{
                                    height: "60px",
                                    width: "100%",
                                }} />
                            </Nav.Item>
                            <Nav.Item eventKey="2" href="#" onClick={this.onOrderClickHandler} icon={<Icon icon="first-order" />}>
                                Orders
                            </Nav.Item>
                            <Nav.Item eventKey="3" href="#" onClick={this.onMenuClickHandler} icon={<Icon icon="book2" />}>
                                Menu
                            </Nav.Item>
                            <Nav.Item eventKey="4" href="#" onClick={this.onProfileClickHandler} icon={<Icon icon="user-info" />}>
                                Profile
                            </Nav.Item>
                            <Nav.Item eventKey="5" href="#" onClick={this.logout} icon={<Icon icon="sign-out" />}>
                                Logout
                            </Nav.Item>
                            {/* <Dropdown eventKey="3" title="Advanced" icon={<Icon icon="magic" />}>
                                <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
                                <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
                                <Dropdown.Item eventKey="3-3">Loyalty</Dropdown.Item>
                                <Dropdown.Item eventKey="3-4">Visit Depth</Dropdown.Item>
                            </Dropdown>
                            <Dropdown
                                eventKey="4"
                                title="Settings"
                                icon={<Icon icon="gear-circle" />}
                            >
                                <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                                <Dropdown.Item eventKey="4-2">Channels</Dropdown.Item>
                                <Dropdown.Item eventKey="4-3">Versions</Dropdown.Item>
                                <Dropdown.Menu eventKey="4-5" title="Custom Action">
                                    <Dropdown.Item eventKey="4-5-1">Action Name</Dropdown.Item>
                                    <Dropdown.Item eventKey="4-5-2">Action Params</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                        </Nav>
                    </Sidenav.Body>
                </Sidenav>
            </div >
        );
    }

}

export default SideNavInstance
