import React, { Component } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ListOrdersPage from './ListOrdersPage'
import '../../App.css';
import '../../Form.css';
/**
 * Restaurant Owner can see:
 * 1. New Orders ==> This Order should have a button to cancel an order
 * 2. Preparing Orders
 * 3. Ready Orders
 * 4. Delivered Orders
 * 5. All Orders
 * 
 * On Clicking the Order, owner should see:
 * a. Ordered Person's Name
 * b. Ordered Person's Address
 * c. All Food-Items that are part of this order
 * d. Status of Order
 */

/**
 * Implemenation Notes:
 * Tabs - New, Preparing, Ready, Delivered, All
 * Each tab will render a list of orders --> ListGroup Component
 * Each order can be clickable, and on click --> PopOver
 */

export class OrderPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentView: "New",
        }
    }

    refreshPage = (e) => {
        console.log("refreshing page");
        this.setState({
            currentView: e,
        })
    }

    render() {
        return (
            <Tabs defaultActiveKey="New" onSelect={this.refreshPage} mountOnEnter={true} unmountOnExit={true}>
                <Tab eventKey="New" title="New">
                    <Tab.Content>
                        <Tab.Pane active="true">
                            <ListOrdersPage status="New" restaurantId={this.props.restaurantId} />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab>
                <Tab eventKey="Preparing" title="Preparing" >
                    <Tab.Content>
                        <Tab.Pane active="true">
                            <ListOrdersPage status="Preparing" restaurantId={this.props.restaurantId} />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab>
                <Tab eventKey="Ready" title="Ready" >
                    <Tab.Content>
                        <Tab.Pane active="true">
                            <ListOrdersPage status="Ready" restaurantId={this.props.restaurantId} />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab>
                <Tab eventKey="Delivered" title="Delivered" >
                    <Tab.Content>
                        <Tab.Pane active="true">
                            <ListOrdersPage status="Delivered" restaurantId={this.props.restaurantId} />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab>
            </Tabs>
        )
    }
}

export default OrderPage
