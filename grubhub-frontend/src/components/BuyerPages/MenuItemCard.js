import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

export class MenuItemCard extends Component {
    render() {
        let itemName = this.props.itemName;
        let itemPrice = this.props.itemPrice;
        return (
            <div style={{width:"100%", height:"100%", backgroundColor:"inherit"}}>
                <Card style={{ borderStyle: "none", 
                width:"100%", 
                height:"100%",  
                backgroundColor:"inherit",
                boxShadow: "0 0 0 1px rgba(67,41,163,.1), 0 1px 8px 0 rgba(67,41,163,.1)",
                paddingBottom: '5px',
                marginBottom: '5px',
                zIndex:"5px" }}>
                    <Card.Body style={{width: "100%", height: "100%"}}>
                        <Card.Title>{itemName}</Card.Title>
                        <Card.Text>
                            {itemPrice}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default MenuItemCard
