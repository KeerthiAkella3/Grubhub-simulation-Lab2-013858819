import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export class MenuItemAddModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            show: true,
            itemName: "",
            itemImage: "",
            imageName:"",
            itemPrice: "",
            itemDesc: "",
            itemSection: "",
        }

        this.handleClose = this.handleClose.bind(this);
        this.onPicUpload = this.onPicUpload.bind(this);
        this.itemDescChangeHandler = this.itemDescChangeHandler.bind(this);
        this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
        this.itemImageChangeHandler = this.itemImageChangeHandler.bind(this);
        this.itemNameChangeHandler = this.itemNameChangeHandler.bind(this);
        this.itemPriceChangeHandler = this.itemPriceChangeHandler.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount = () => {
        this.setState({
            itemSection : this.props.sectionName,
        })
    }

    itemNameChangeHandler = (e) => {
        this.setState({
            itemName: e.target.value
        })
    }

    itemDescChangeHandler = (e) => {
        this.setState({
            itemDesc: e.target.value
        })
    }

    itemImageChangeHandler = (e) => {
        this.setState({
            itemImage: e.target.value
        })
    }

    itemPriceChangeHandler = (e) => {
        this.setState({
            itemPrice: e.target.value
        })
    }

    handleClose = (e, closeCallback) => {
        this.setState({
            show: false
        })
        closeCallback();
    }

    handleSave = (e, saveCallback) => {
        console.log('Saving Menu Item -- In Modal');
        console.log(e);
        this.setState({
            show: false
        })
        saveCallback(this.state);
    }

    onPicUpload = (e) => {
        this.setState({
            itemImage: e.target.files[0],
        })
    }

    // CREATE TABLE restaurantMenuTable(
    //     menuItemId INT NOT NULL AUTO_INCREMENT,
    //     menuItemName VARCHAR(100) NOT NULL,
    //     menuItemDesc VARCHAR(100) NOT NULL,
    //     menuItemImage BLOB,
    //     menuItemPrice float(5) NOT NULL,
    //     menuItemSection ENUM('Lunch', 'Appetizers', 'Breakfast'),
    //     menuItemCuisine VARCHAR(100) NOT NULL,
    //     restaurantId INT NOT NULL, /* This points to which restaurant i.e., Restaurant this menu Item belongs to */
    //     PRIMARY KEY(menuItemId),
    // );
    render() {

        let imageDiv = (<div className='buttons fadein'>
            <div className='button'>
                <label htmlFor='single'>
                    <img src={this.state.restaurantImage} alt="Profile pic" height="40px" width="60px" ></img>
                </label>
                {/* <input type='file' id='single' name="selectedFile" onChange={this.onPicUpload} style={{ height: "0px", width: "0px" }} accept="image/x-png,image/gif,image/jpeg" /> */}
            </div>
        </div>);

        return (
            <div>
                <Modal show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose);
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Item to Menu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formItemName">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control onChange={this.itemNameChangeHandler} type="text" placeholder="item name" />
                            </Form.Group>
                            <Form.Group controlId="formItemDesc">
                                <Form.Label>Item Description</Form.Label>
                                <Form.Control onChange={this.itemDescChangeHandler} type="text" placeholder="item name" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPrice">
                                <Form.Label>Item Price</Form.Label>
                                <Form.Control onChange={this.itemPriceChangeHandler} type="text" placeholder="0.00" />
                            </Form.Group>
                            {/* <Form.Group controlId="forBasicSection">
                                <Form.Label>Item Section</Form.Label>
                                <Form.Check onChange={this.itemSectionChangeHandler} id="appetizer" type="radio" label="Appetizers" />
                                <Form.Check onChange={this.itemSectionChangeHandler} id="lunch" type="radio" label="Lunch" />
                                <Form.Check onChange={this.itemSectionChangeHandler} id="breakfast" type="radio" label="Breakfast" />
                            </Form.Group> */}

                            <Form.Group controlId='buyerImage'>
                                <Form.Label>Menu Item Image</Form.Label>
                                {imageDiv}
                                <Form.Control as='input' type='file' onChange={this.onPicUpload} />
                            </Form.Group>
                            {/* <Form.Group controlId="forBasicSection">
                                <Form.Label>Item Cuisine</Form.Label>
                                <Form.Control onChange={this.itemCuisineChangeHandler} type="text" placeholder="Italian..." />
                            </Form.Group> */}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e) => {
                            this.handleClose(e, this.props.onClose)
                        }}>Close</Button>
                        <Button type="submit" variant="primary" onClick={(e) => {
                            this.handleSave(e, this.props.onSave)
                        }}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}

export default MenuItemAddModal