import React, { Component } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import OrderBrief from './OrderBrief'
import axios from 'axios';
import cookie from 'react-cookies'
import Draggable from 'react-draggable'
import { Rnd } from "react-rnd";

export class ListOrdersPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            allOrdersData: {},
            orderStatus: "New",
            activeDrags: 0,
            deltaPosition: {
                x: 0, y: 0
            },
            controlledPosition: {
                x: -400, y: 200
            }

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

    handleDrag = (e, ui) => {
        const { x, y } = this.state.deltaPosition;
        this.setState({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY,
            }
        });
    };

    onStart = () => {
        this.setState({ activeDrags: ++this.state.activeDrags });
    };

    onStop = () => {
        this.setState({ activeDrags: --this.state.activeDrags });
    };

    // For controlled component
    adjustXPos = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { x, y } = this.state.controlledPosition;
        this.setState({ controlledPosition: { x: x - 10, y } });
    };

    adjustYPos = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { controlledPosition } = this.state;
        const { x, y } = controlledPosition;
        this.setState({ controlledPosition: { x, y: y - 10 } });
    };

    onControlledDrag = (e, position) => {
        const { x, y } = position;
        this.setState({ controlledPosition: { x, y } });
    };

    onControlledDragStop = (e, position) => {
        this.onControlledDrag(e, position);
        this.onStop();
    };


    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        const { deltaPosition, controlledPosition } = this.state;
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
                <Rnd default={{y:index*100+10, width: "100%", height: "100%"}}>
                    <OrderBrief key={index} anOrderData={anOrderData} orderStatus={this.state.orderStatus} />
                </Rnd>
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
