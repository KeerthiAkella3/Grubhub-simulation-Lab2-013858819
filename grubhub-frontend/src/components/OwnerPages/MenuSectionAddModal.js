import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import cookie from 'react-cookies'


export class MenuSectionAddModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            show: true,
            sectionName: "",
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.sectionNameChangeHandler = this.sectionNameChangeHandler.bind(this);
    }

    sectionNameChangeHandler = (e) => {
        this.setState({
            sectionName: e.target.value,
        })
    }

    handleSave = (e, saveCallback) => {
        console.log('Saving section addition to DB now');
        console.log(e);
	e.preventDefault();
        let restaurantId = cookie.load('cookie2');
        axios.post('http://18.220.10.109:3001/restaurantSection', {
            restaurantId: restaurantId,
            sectionName: this.state.sectionName,
        }).then(response => {
            if (response.status === 200) {
                console.log('Successfully added the section');
                // alert('successfully added the section');
                this.setState({
                    show: false,
                })
            } else {
                alert('failed to add section');
                console.log('Failed to add the section');
            }
        saveCallback(this.state.sectionName);
        }).catch(error => {
            console.log(error);
        })
    }

    handleClose = (e, closeCallback) => {
        this.setState({
            show: false,
        })
        closeCallback();
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show} onHide={(e) => {
                    this.handleClose(e, this.props.onClose);
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Section to Menu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formItemName">
                                <Form.Label>Section Name</Form.Label>
                                <Form.Control onChange={this.sectionNameChangeHandler} type="text" placeholder="section name" />
                            </Form.Group>
                            <Button variant="secondary" onClick={(e) => {
                                this.handleClose(e, this.props.onClose)
                            }}>Close</Button>
                            <Button type="submit" variant="primary" onClick={(e) => {
                                this.handleSave(e, this.props.onSave)
                            }}>Save</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div >
        )
    }
}

export default MenuSectionAddModal
