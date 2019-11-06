import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import Container from 'react-bootstrap/Container'
import { Icon } from 'rsuite'
import { IconButton } from 'rsuite'
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import BuyerNavBar from './BuyerNavBar'


/**
 * Displays a Search Bar where Buyer can search for an item
 * Displays a list of all Cards arranged in matrix.
 * Each card lists a restaurant and corresponding cuisine 
 */
export class BuyerHomePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchItemName: "",
            searchResults: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.searchItemChangeHandler = this.searchItemChangeHandler.bind(this);
    }

    handleLogout = (e) => {
        localStorage.clear();
        console.log("All cookies removed!");
        window.location = "/";
    }

    handleSubmit = (e) => {
        if (e.key && e.key !== "Enter") {
            return;
        }
        console.log("Hmm.. You are searching for " + this.state.searchItemName);
        e.preventDefault();
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.get('http://localhost:3001/menuItem', {
            params: {
                menuItemName: this.state.searchItemName,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    let matchedItems = response.data.matchedItems;
                    console.log('matched items in db:')
                    console.log(matchedItems)
                    let searchResults = []
                    let index = 0;
                    for (index = 0; index < matchedItems.length; index++) {
                        searchResults.push(matchedItems[index]);
                    }
                    this.setState({
                        searchResults: searchResults,
                    })
                } else {
                    console.log("Status Code: ", response.status);
                    console.log(response.data.responseMessage);
                }
            }).catch(error => {
                console.log(error);
            });
    }

    searchItemChangeHandler = (e) => {
        this.setState({
            searchItemName: e.target.value
        })
    }

    render() {
        if (this.state.searchResults && this.state.searchResults.length > 0) {
            return (
                <Redirect
                    to={{
                        pathname: '/BuyerSearchPage',
                        state: { searchResults: this.state.searchResults,
                        searchQuery: this.state.searchItemName, }
                    }}
                />
            );
        }

        let buyerHomePageRow = {
            height: "40%",
            width: "100%",
            paddingTop: "175px",
            backgroundImage: "url(./PizzaBuyerHomePage.webp)",
            alignItems: "center",
        };

        let buyerHomePageContainer = {
            width: "100%",
            height: "100%",
            marginRight: "0%",
            marginLeft: "0%",
            maxWidth: "100%",
        }

        let buyerHomePageDiv = {
            width: "100%",
            height: "100%",
            paddingLeft: "0%",
            marginRight: "0%",
        }

        let buyerSearchForm = {
            width: "inherit",
            height: "inherit",
            alignItems: "center",
            paddingLeft: "0%",
        }

        let buyerSearchBox = {
            width: "1000px",
            height: "inherit",
            alignItems: "center",
            paddingLeft: "0%",
        }

        let buyerHomePageCol = {
            width: "100%",
            height: "100%",
            alignItems: "center",
            paddingLeft: "0%",
        }

        return (
            <div style={buyerHomePageDiv}>
                {/* Navbar with GRUBHUB Brand Logo */}
                {/* <Navbar bg="light" expand="lg" style={{ */}
                <BuyerNavBar disableHome={true}/>
                <Container style={buyerHomePageContainer}>
                    <Row style={{
                        // height: '50px'
                    }}></Row>
                    <Row style={buyerHomePageRow}>
                        <Col style={buyerHomePageCol}></Col>
                        <Col style={buyerHomePageCol}>
                            <Form style={buyerSearchForm}>
                                <Form.Group style={{
                                    alignItems: "center",
                                }}>
                                    <Form.Label style={{
                                        fontSize: "34px",
                                        display: "block",
                                        lineHeight: "1.243",
                                        color: "white",
                                        fontWeight: '900'
                                    }}>Who delivers in neighborhood ?</Form.Label>
                                    <Form.Label style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        display: 'block',
                                        color: 'white',
                                    }}>What do you feel like ?</Form.Label>
                                    <InputGroup className="mb-3" style={buyerSearchBox}>
                                        <FormControl
                                            placeholder="Pizza, sushi, chinese..."
                                            aria-label="search"
                                            aria-describedby="basic-addon2"
                                            onChange={this.searchItemChangeHandler}
                                            onKeyPress={this.handleSubmit}
                                        />
                                        <InputGroup.Append>
                                            {/* Need Internet to get this icon */}
                                            <IconButton onClick={this.handleSubmit} className="btn btn-outline-secondary" color="blue" icon={<Icon icon="search" />}>
                                            </IconButton>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row></Row>
                </Container>
            </div>
        )
    }
}

export default BuyerHomePage
