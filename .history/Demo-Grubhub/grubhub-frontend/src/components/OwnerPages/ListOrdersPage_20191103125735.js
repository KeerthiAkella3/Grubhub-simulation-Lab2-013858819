import React, { Component } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import OrderBrief from './OrderBrief'
import axios from 'axios';
import cookie from 'react-cookies'


export class ListOrdersPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            allOrdersData: {},
            orderStatus: "New",
        }
        // this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.getDataFromDB = this.getDataFromDB.bind(this);
    }

    // handleChangeStatus = (e, newStatus) => {
    //     this.getDataFromDB();
    //     this.setState({
    //         orderStatus: newStatus,
    //     })
    // }

    getDataFromDB = () => {
        const statusOfAllOrders = this.props.status;
        const restaurantId = cookie.load('cookie1');
        console.log("Asking backend for details on restaurant with ID = " + restaurantId + " and with status = " + statusOfAllOrders);
       // e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/restaurantOrders', {
            params: {
                restaurantId: restaurantId,
                orderStatus: statusOfAllOrders,
            }
        }).then(response => {
            if (response.status === 200) {
                console.log("Response on order details: ");
                console.log(response.data.orderDetails);
                let orderDetails = response.data.orderDetails;
                if (orderDetails) {
                    this.setState({
                        allOrdersData: orderDetails,
                        orderStatus: statusOfAllOrders,
                    })
                } else {
                    this.setState({
                        allOrdersData: {},
                        orderStatus: statusOfAllOrders,
                    })
                }
            } else {
                console.log("Status Code: ", response.status);
                console.log(response.data.responseMessage);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount = () => {
        this.getDataFromDB();
    }

    render() {
        var listGroupOrders = [];
        const listOfAllOrders = this.state.allOrdersData;
        let listGroupStyle = {
            paddingTop: "5px",
            paddingBottom: "5px",
        }
        // listOfAllOrders is an array that contains each order information
        for (let index = 0; index < listOfAllOrders.length; index++) {
            let anOrderData = listOfAllOrders[index];
            listGroupOrders.push(
                <OrderBrief anOrderData={anOrderData} orderStatus={this.state.orderStatus}/>
            );
        }

        return (
            <ListGroup defaultActiveKey="#link1">
                {listGroupOrders}
            </ListGroup>
        )
    }
}

export default ListOrdersPage
