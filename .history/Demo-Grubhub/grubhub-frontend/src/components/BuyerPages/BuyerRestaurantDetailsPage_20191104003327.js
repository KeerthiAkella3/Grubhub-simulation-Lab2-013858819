import React, { Component } from 'react'
import axios from 'axios';
import MenuItemCard from './MenuItemCard';
import Table from 'react-bootstrap/Table';
import RestaurantBanner from './RestaurantBanner';
import ListGroup from 'react-bootstrap/ListGroup'
import DefineQuantity from './DefineQuantity'
import ShoppingCart from './ShoppingCart';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import cookie from 'react-cookies';
import PlaceOrder from './PlaceOrder';
import BuyerNavBar from './BuyerNavBar';

export class BuyerRestaurantDetailsPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            restaurantName: "",
            restaurantId: 0,
            restaurantEmailId: "",
            restaurantAddress: "",
            restaurantPhone: 0,
            restaurantCusine: "",
            buyerName: "",
            buyerEmailId: "",
            buyerAddress: "",
            buyerOrderStatus: "",
            showQuantitySelector: false,
            clickedItem: undefined,
            cartItems: [],
            showPlaceOrderModal: false,
            items: [],
            sections: [],
        }

        this.launchQuantitySelector = this.launchQuantitySelector.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this)
        this.onMouseOver = this.onMouseOver.bind(this)
        this.placeOrder = this.placeOrder.bind(this)
    }

    onMouseOver = (e) => {
        this.setState({
            listGroupItemColor: "#BBB9B9"
        })
    }

    onMouseOut = (e) => {
        this.setState({
            listGroupItemColor: "#F7F7F7"
        })
    }

    launchQuantitySelector = (e, clickedItem) => {
        console.log("Handling Click on Menu Item");
        console.log(clickedItem);
        this.setState({
            clickedItem: clickedItem,
            showQuantitySelector: true,
        })
    }

    saveCallback = (order, orderedItem) => {
        this.setState({
            cartItems: this.state.cartItems.concat({
                itemId: orderedItem.itemId,
                itemName: orderedItem.itemName,
                itemQuantity: order.quantity,
                itemTotalPrice: order.totalPrice
            }),
            showQuantitySelector: false
        })
    }

    closeCallback = () => {
        this.setState({
            showQuantitySelector: false
        })
    }

    closePlaceOrderCallback = () => {
        this.setState({
            showPlaceOrderModal: false,
        })
    }

    componentDidMount() {
        let restaurantId = this.props.location.state.restaurantId;
        let buyerId = cookie.load('cookie1');
        // debugger;
        axios.defaults.withCredentials = true;
        console.log("Getting details of buyer with ID: " + buyerId);
        axios.get('http://localhost:3001/buyerDetails', {
            params: {
                buyerId: buyerId,
            }
        }).then(response => {
            console.log("Response on buyer details: ");
            console.log(response.data.buyerDetails);
            if (response.status === 200) {
                let buyerDetails = response.data.buyerDetails;
                if (buyerDetails) {
                    this.setState({
                        buyerName: buyerDetails._id,
                        buyerEmailId: buyerDetails.buyerEmail,
                        buyerAddress: buyerDetails.buyerAddress,
                        buyerId: buyerDetails.buyerId,

                    })
                }
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
        }).catch(error => {

        });

        console.log("Getting details of restaurant with ID: " + restaurantId);
        axios.get('http://localhost:3001/restaurantDetails', {
            params: {
                restaurantId: restaurantId,
            }
        }).then(response => {
            console.log("Response on restaurant details: ");
            console.log(response.data.restaurantDetails);
            if (response.status === 200) {
                let restaurantDetails = response.data.restaurantDetails;
                if (restaurantDetails) {
                    this.setState({
                        restaurantName: restaurantDetails.restaurantName,
                        restaurantEmailId: restaurantDetails.restaurantEmail,
                        restaurantAddress: restaurantDetails.restaurantAddress,
                        restaurantCuisine: restaurantDetails.cuisine,
                        restaurantPhone: restaurantDetails.restaurantPhoneNumber,
                        restaurantId: _id,
                    })
                }
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
        }).catch(error => {

        });


        axios.get('http://localhost:3001/menu', {
            params: {
                restaurantId: restaurantId
            }
        })
            .then(response => {
                if (response.status === 200) {
                    let menu = response.data.menu;
                    let sections = response.data.sections;
                    let index = 0;
                    this.setState({
                        items: menu,
                        sections: sections,
                    })
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }
            }).catch(error => {
                console.log(error);
            });
    }

    /**
 * Order Summary:
 * RestaurantName, RestaurantEmailId, Restaurant Address
 * BuyerName, BuyerAddress, BuyerAddress
 * Status of Order for Buyer
 * All the items and corresponding quantity
 * Price of each item purchased
 * Total Price of all items
 */

    // Send data to backend and then to database.
    // buyerName
    // buyerAddress
    // OrderedItems
    // Total Price
    // restaurant E-Mail Id
    placeOrder = (completeOrder, netPrice) => {
        console.log("Handling place order");
        const data = {
            restaurantEmailId: this.state.restaurantEmailId,
            restaurantId: this.state.restaurantId,
            buyerEmailId: this.state.buyerEmailId,
            buyerAddress: this.state.buyerAddress,
            cartItems: this.state.cartItems,
            buyerName: this.state.buyerName,
            restaurantId : this.state.restaurantId,
            buyerId : this.state.buyerId,
            restaurantOrderStatus : "New",
            buyerOrderStatus : "Upcoming",
            totalPrice : netPrice,
        }
        console.log("order data:");
        console.log(data);
        axios.post('http://localhost:3001/postOrder', data)
            .then(response => {
                if (response.status === 200) {
                    let menu = response.data.menu;
                    let restaurantDetails = response.data.restaurantDetails;
                    let index = 0;

                    this.setState({
                        restaurantId: restaurantDetails.restaurantId,
                        restaurantEmailId: restaurantDetails.restaurantEmailId,
                        restaurantName: restaurantDetails.restaurantName,
                        restaurantCuisine: restaurantDetails.restaurantCuisine,
                        restaurantPhone: restaurantDetails.restaurantPhone,
                    })
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }
            }).catch(error => {
                console.log(error);
            });
        console.log("Printing Complete Order")
        console.log(completeOrder);
        this.setState({
            showPlaceOrderModal: true,
            buyerOrderStatus: "New",
        })
    }

    placeOrderClose = () => {
        this.setState({
            showPlaceOrderModal: false,
        })
    }

    render() {
        let MenuDOM = [];
        let ModalQuantitySelector = [];
        let placeOrderModalDOM = [];
        let restaurantName = this.props.location.state.restaurantName;
        let listGroupStyle = {
            paddingTop: "5px",
            paddingBottom: "5px",
            color: "inherit",
            backgroundColor: "inherit",
            borderStyle: "none",
        }
        if (this.state.showPlaceOrderModal === true) {
            placeOrderModalDOM = <PlaceOrder
                cartItems={this.state.cartItems}
                onClose={this.closePlaceOrderCallback}
                restaurantName={this.state.restaurantName}
                restaurantAddress={this.state.restaurantAddress}
                buyerName={this.state.buyerName}
                buyerAddress={this.state.buyerAddress}
            />;
        }

        let sections = this.state.sections;
        let menuItems = this.state.items;
        for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
            let sectionData = [];
            for (let menuItemIndex = 0; menuItemIndex < menuItems.length; menuItemIndex++) {
                let aMenuItem = menuItems[menuItemIndex];
                if (aMenuItem.itemSection === sections[sectionIndex]) {
                    sectionData.push(
                        <ListGroup.Item action key={menuItemIndex} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={(e) => {
                            this.launchQuantitySelector(e, menuItems[menuItemIndex])
                        }} style={listGroupStyle}>
                            <MenuItemCard itemName={menuItems[menuItemIndex].itemName} itemPrice={menuItems[menuItemIndex].itemPrice} />
                        </ListGroup.Item>
                    );
                }
            }
            if (sectionData.length > 0) {
                MenuDOM.push(
                    <Row>
                        <h4>{sections[sectionIndex]}</h4>
                        {sectionData}
                    </Row>);
            }
        }

        if (this.state.showQuantitySelector === true) {
            ModalQuantitySelector = <DefineQuantity
                clickedItem={this.state.clickedItem}
                onSave={this.saveCallback}
                onClose={this.closeCallback}
            />;
        }

        let ShoppingCartDOM = [];
        if (this.state.cartItems.length > 0) {
            ShoppingCartDOM.push(
                <Col>
                    <ShoppingCart cartItems={this.state.cartItems} placeOrder={this.placeOrder} />
                </Col>
            );
        }

        // make a query to database and get items, sections in restaurant's menu
        // Load the information to cards 
        // Section
        // Item-Name
        // Item-Price
        // Dropdow to mention quantity
        // Button to add to cart
        // Cart symbol that updates with each item
        // Place Order button 
        // Similar to grubhub page

        return (
            <div>
                <BuyerNavBar />
                <RestaurantBanner restaurantName={restaurantName} />
                <Container style={{
                    maxWidth: "100%",
                    width: "100%",
                    heigth: "100%",
                    marginLeft: "0",
                    marginRight: "0",
                }}>
                    <Row style={{
                        width: "100%",
                        height: "100%",
                        marginLeft: "0",
                        marginRight: "0",
                    }}>
                        <Col sm={7} style={{
                            paddingLeft: "0",
                            paddingRight: "0",
                        }}>
                            <Container style={{
                                maxWidth: "100%",
                                width: "100%",
                            }}>
                                {MenuDOM}
                            </Container>
                        </Col>
                        <Col sm={5}>
                            {ShoppingCartDOM}
                        </Col>
                    </Row>
                </Container>
                {ModalQuantitySelector}
                {placeOrderModalDOM}
            </div>
        );
    }
}

export default BuyerRestaurantDetailsPage
