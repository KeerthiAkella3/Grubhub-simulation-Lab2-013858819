import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export class OwnerMenuItemCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            handleDeleteItem : undefined,
        }
        this.deleteMenuItemHandler = this.deleteMenuItemHandler.bind(this);
    }

    componentDidMount = () => {
        this.setState({
            handleDeleteItem: this.props.deleteItemButtonHandler,
        })
    }

    deleteMenuItemHandler = (e, itemId) => {
        // Tell parent component that an item is deleted and update state with now available items in menu
        this.state.handleDeleteItem(e, itemId);
    }

    render() {
        let itemName = this.props.itemName;
        let itemPrice = this.props.itemPrice;
        let itemImage = null;
        if (this.props.itemImage) {
            itemImage = "data:image/png;base64," + this.props.itemImage;
            console.log(itemImage)
        }
        console.log("Menu Card item name " + itemName + " and section: " + this.props.itemSection);
        return (
            <div style={{ width: "inherit", 
            height: "inherit",
            marginRight: '10px',
            marginBottom: '10px',
            zIndex: '3',
            boxShadow: '3px'
             }}>
                <Card style={{ borderStyle: "none", width: "inherit", height: "100%" }}>
                    <Card.Body style={{ width: "inherit", height: "100%" }}>
                        <Card.Title>{itemName}</Card.Title>
                        <Card.Text>
                            {itemPrice}
                        </Card.Text>
                        <Card.Img variant="top" src={itemImage} style={{
                            height: "80px",
                            width: "120px",
                            paddingBottom: "5px"}}/>
                        {/* <img src={itemImage} alt="Profile pic" height="40px" width="60px" ></img> */}
                        <br/>
                        <Button variant="danger" onClick={ (e) => {
                            this.deleteMenuItemHandler(e, this.props.itemId)
                            }}>Delete</Button>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default OwnerMenuItemCard
