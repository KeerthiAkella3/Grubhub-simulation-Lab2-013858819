import React, { Component } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import GrubHubForRestaurants from '../../images/grubhub-full-logo.svg'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import BuyerFilterSearchPage from './BuyerFilterSearchPage'
import { Redirect } from 'react-router-dom'
import BuyerNavBar from './BuyerNavBar'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import ReactDOM from "react-dom";
import PageItem from 'react-bootstrap/PageItem'
import Pagination from 'react-bootstrap/Pagination'

/**
 * List all search results:
 * - Each result will have item Name and restaurant which has that item
 * - filter based on the cuisine 
 * - Left "div" to support filtering
 * - Right "div" to list search results
 * - Top "div" with GRUBHUB banner at left
 * - Select a restaurant and go to details view
 */
export class BuyerSearchPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchResults: [],
            listGroupItemColor: "inherit",
            filterByCuisine: undefined,
            nextPagePathName: undefined,
            searchQuery: undefined
        }
        this.handleFilterSelect = this.handleFilterSelect.bind(this);
    }

    componentWillMount = () => {
        if (this.props.location.state) {
            this.setState({
                seachQuery: this.props.location.state.seachQuery,
                searchResults: this.props.location.state.searchResults,
            })
        }
    }

    handleFilterSelect = (e) => {
        console.log("handling filter select");
        console.log(e);

        // //make a post request with the user data
        // axios.get('http://localhost:3001/menuItem', {
        //     params: {
        //         menuItemName: this.state.searchQuery
        //     }
        // })
        //     .then(response => {
        //         if (response.status === 200) {
        //             let matchedItems = response.data.matchedItems;
        //             let index = 0;
        //             let searchResults = [];
        //             for (index = 0; index < matchedItems.length; index++) {
        //                 searchResults.push(matchedItems[index]);
        //             }
        //             this.setState({
        //                 searchResults: searchResults,
        //                 filterByCuisine: e.value,
        //             })
        //         } else {
        //             console.log("Status Code: ", response.status);
        //             console.log(response.data.responseMessage);
        //         }
        //     }).catch(error => {
        //         console.log(error);
        //     });
        this.setState({
            filterByCuisine: e.value,
        })

    }

    onMouseOver = (e) => {
        this.setState({
            listGroupItemColor: "#BBB9B9"
        })
    }

    onMouseOut = (e) => {
        this.setState({
            listGroupItemColor: "F7F7F7"
        })
    }

    searchResultClickHandler = (e, anItem) => {
        console.log("Clicked on ");
        console.log(anItem);
        console.log("Sending to details Page the restaurant ID=" + anItem.restaurantId);
        this.setState({
            nextPagePathName: "/BuyerRestaurantDetailsPage",
            restaurantId: anItem.restaurantId,
            restaurantName: anItem.restaurantName,
        })
    }
    
    render() {
        // console.log(this.state);
        if (this.state.nextPagePathName && this.state.nextPagePathName !== "") {
            return (
                <Redirect
                    to={{
                        pathname: this.state.nextPagePathName,
                        state: {
                            restaurantId: this.state.restaurantId,
                            restaurantName: this.state.restaurantName,
                        }
                    }}
                />
            );
        }

        let index = 0;
        let searchResults = this.state.searchResults;
        let listGroupOrders = [];
        let filterByCuisine = this.state.filterByCuisine;
        // listOfAllOrders is an array that contains each order information
        for (index = 0; searchResults && index < searchResults.length; index++) {
            let anItem = searchResults[index];
            let listGroupStyle = {
                paddingTop: "5px",
                paddingBottom: "5px",
                color: "inherit",
                style: "{{ backgroundColor: this.state.listGroupItemColor }}",
            }

            console.log(anItem.restaurantCuisine)
            console.log(filterByCuisine)
            if (filterByCuisine !== undefined && filterByCuisine !== anItem.restaurantCuisine) {
                // console.log(anItem.restaurantCuisine)
                continue;
            } else {
                let active = 2;
                for (let number = 1; number <= 5; number++) {
                listGroupOrders.push(
                    <Pagination.Item key={number} active={number === active}>
                    <ListGroup.Item eventKey={anItem.restaurantName} action onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={(e) => {
                        this.searchResultClickHandler(e, anItem)
                    }} style={listGroupStyle}>
                        <Card as="a" style={{
                            borderStyle: "none",
                            width: "100%",
                            height: "100%",
                            color: "inherit",
                            backgroundColor: "inherit",
                            marginLeft: "none",
                            marginRight: "none",
                            marginTop: "none",
                            marginBotton: "none",
                        }}>
                            <Card.Body>
                                <Card.Title>{anItem.restaurantName}</Card.Title>
                                <Card.Text>
                                    Cuisine: {anItem.restaurantCuisine}
                                </Card.Text>
                                <Card.Text>
                                    {anItem.itemName}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                    </Pagination.Item>
                );
                    }
            }
        }
       
        
        
        const paginationBasic = (
          <div>
            <Pagination>{listGroupOrders}</Pagination>
            <br />
        
            <Pagination size="lg">{listGroupOrders}</Pagination>
            <br />
        
            <Pagination size="sm">{listGroupOrders}</Pagination>
          </div>
        );
        
        
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }}>
                {/* Navbar with GRUBHUB Brand Logo */}
                <BuyerNavBar />
                <Container style={{
                    marginLeft: "0%",
                    marginRight: "0%",
                    paddingBottom: "5px",
                    width: "100%",
                    height: "100%",
                    paddingLeft: "0%",
                    paddingRight: "0%",
                    maxWidth: "100%",
                }}>
                    <Row style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginLeft: "0%",
                        marginRight: "0%",
                        paddingLeft: "0%",
                        paddingRight: "0%",
                        height: "100%",
                        width: "100%",
                        borderRight: "none",
                    }}>
                        <Col style={{
                            flexBasis: "0",
                            flexGrow: "1",
                            marginLeft: "0%",
                            marginRight: "0%",
                            paddingLeft: "0%",
                            paddingRight: "0%",
                            height: "100%",
                            width: "100%",
                            maxWidth: "25%",
                            boxShadow: "0 0 0 1px rgba(67,41,163,.1), 0 1px 8px 0 rgba(67,41,163,.1)",
                            backgroundColor: "#fbfbfc",
                            zIndex: "3",
                        }}>
                            {/* <BuyerFilterSearchPage onOptionClick={this.handleSideBarSelect} />  */}
                            <BuyerFilterSearchPage onSelectingOption={this.handleFilterSelect} />
                        </Col>
                        {/* Based on what user clicks in sidebar, we need to display appropriate component. Default is Orders page */}
                        <Col style={{
                            borderRight: "none",
                            flexBasis: "0",
                            flexGrow: "1",
                            marginLeft: "0%",
                            marginRight: "0%",
                            paddingLeft: "0%",
                            paddingRight: "0%",
                            height: "100%",
                            // marginLeft: "25%",
                            maxWidth: "100%",
                            // borderRight: "1px solid",
                            boxShadow: "0 0 0 1px rgba(67,41,163,.1), 0 1px 8px 0 rgba(67,41,163,.1)",
                            backgroundColor: "white",
                            zIndex: "1",
                        }}>
                            <ListGroup defaultActiveKey="#link1">
                            {paginationBasic}
                                <Pagination>
                                    <Pagination.First />
                                    <Pagination.Prev />
                                    <Pagination.Item>{1}</Pagination.Item>
                                    <Pagination.Ellipsis />

                                    <Pagination.Item>{10}</Pagination.Item>
                                    <Pagination.Item>{11}</Pagination.Item>
                                    <Pagination.Item active>{12}</Pagination.Item>
                                    <Pagination.Item>{13}</Pagination.Item>
                                    <Pagination.Item disabled>{14}</Pagination.Item>

                                    <Pagination.Ellipsis />
                                    <Pagination.Item>{20}</Pagination.Item>
                                    <Pagination.Next />
                                    <Pagination.Last />
                                </Pagination>
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default BuyerSearchPage