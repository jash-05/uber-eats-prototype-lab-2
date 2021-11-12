import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import HeartCheckbox from 'react-heart-checkbox';
import Navbar from './navbar';
import { Link, Redirect } from 'react-router-dom';
import FormSelect from 'react-bootstrap/FormSelect';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Accordion from 'react-bootstrap/Accordion';
import server_IP from '../config/server.config.js';
import Pagination from 'react-bootstrap/Pagination';

// Define a Login Component
class CustomerOrders extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            customer_ID: cookie.load('customer'),
            showModal: false,
            fetchedOrders: [],
            selectedOrderFilter: "all",
            paginationLimit: 5,
            pageNumbers: []
        }
        //Bind the handlers to this class
        this.fetchOrders = this.fetchOrders.bind(this);
        this.selectedOrderFilterChangeHandler = this.selectedOrderFilterChangeHandler.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.fetchOrders('all', 5, 1);
    }
    fetchOrders = async (filter, paginationLimit, pageNumber) => {
        try {
            console.log('Fetching orders')
            const data = {
                customer_ID: cookie.load('customer'),
                filter: filter,
                toSkip: (pageNumber - 1) * paginationLimit,
                limit: parseInt(paginationLimit)
            }
            console.log("Sending request to fetch orders with the following params: ")
            console.log(data)
            const response = await axios.get(`http://${server_IP}:3001/fetchOrdersForCustomer`, {params: data})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request of fetching orders");
                console.log(response.data);
                let page_numbers = this.state.pageNumbers
                if (parseInt(pageNumber) === 1) {
                    const payload = {
                        customer_ID: this.state.customer_ID,
                        filter: filter,
                        limit: parseInt(paginationLimit)
                    }
                    const res = await axios.get(`http://${server_IP}:3001/fetchPageNumbersForCustomerOrders`, {params: payload})
                    console.log("Successful request of fetching page numbers")
                    console.log(res.data)
                    let updated_page_numbers = []
                    for (let i=1; i<=res.data.numberOfPages; i++) {
                        updated_page_numbers.push({
                            pageNumber: i,
                            isHighlighted: (i===1 ? true : false)
                        })
                    }
                    page_numbers = updated_page_numbers;
                }
                this.setState({
                    fetchedOrders: response.data,
                    pageNumbers: page_numbers
                })
                console.log('Cookie status: ', cookie.load('cookie'));
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    selectedOrderFilterChangeHandler = async e => {
        await this.fetchOrders(e.target.value, this.state.paginationLimit, 1)
        this.setState({
            selectedOrderFilter: e.target.value
        })
    }
    paginationLimitChangeHandler = async e => {
        await this.fetchOrders(this.state.selectedOrderFilter, e.target.value, 1);
        this.setState({
            paginationLimit: e.target.value
        })
    }
    orderStatusChangeHandler = async e => {
        console.log(e)
        if (["placed", "preparing","delivered", "cancelled"].includes(e.target.value)) {
            try {
                const data = {
                    order_ID: e.target.id,
                    order_status: e.target.value
                }
                const response = await axios.post(`http://${server_IP}:3001/updateOrderStatus`, data)
                if (response.status === 200) {
                    console.log("Successful request")
                    console.log(response.data)
                    await this.fetchOrders();
                    window.location.reload(false);
                } else {
                    console.log("Unsuccessful request")
                }
            } catch (err) {
                console.error(err)
            }
        }
    }
    paginationButtonClickHandler = async e => {
        await this.fetchOrders(this.state.selectedOrderFilter, this.state.paginationLimit, parseInt(e.target.text))
        let updatedPageNumbers = []
        for (let i=0; i<this.state.pageNumbers.length; i++) {
            if (this.state.pageNumbers[i].pageNumber === parseInt(e.target.text)) {
                updatedPageNumbers.push({
                    ...this.state.pageNumbers[i],
                    isHighlighted: true
                })
            } else {
                updatedPageNumbers.push({
                    ...this.state.pageNumbers[i],
                    isHighlighted: false
                })
            }
        }
        this.setState({
            pageNumbers: updatedPageNumbers
        })
    }
    render(){
        console.log("Rendering")
        console.log(this.state.fetchedOrders)
        let redirectVar = null;
        if (!cookie.load('customer')){
            redirectVar = <Redirect to="/welcomeUser"/>
        }
        const capitalizeFirstLetter = text => {
            return text.charAt(0).toUpperCase() + text.slice(1)
        }
        const createDishItemRow = row => {
            return (
                <Row>
                    <Col xs={1}> {row.quantity} </Col>
                    <Col xs={9}> {row.dish_name} </Col>
                    <Col xs={2}> {`$${Math.round(row.quantity * row.price * 100)/100}`} </Col>
                </Row>
            )
        } 
        const formatDishes = (dish_IDs, dish_names, dish_prices, dish_quantities) => {
            return dish_IDs.map((id, index) => {
                return {
                    dish_ID: id,
                    dish_name: dish_names[index],
                    price: dish_prices[index],
                    quantity: dish_quantities[index]
                }
            })
        }
        const createOrderRow = row => {
            return (
                <Col className="m-3 px-5 mx-5">
                    <Card style={{width: "50rem"}}>
                    <Card.Header>
                        <Row className="p-1">
                        <Col xs={7}>
                            Status: <strong>{capitalizeFirstLetter(((row.order_status==="placed") ? "New Order" : row.order_status))}</strong>
                        </Col>
                        <Col xs={3}>
                            Order # {row.order_ID.slice(0,3).toUpperCase()}
                        </Col>
                        <Col xs={2}>
                            {`$${row.total_amount ? row.total_amount : ""}`}
                        </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Link to={`/restaurants/${row.restaurant_info.restaurant_ID}`} style={{ textDecoration: 'none' }}>
                            <Card.Title className="text-dark">{`${row.restaurant_info.restaurant_name}`}</Card.Title>
                        </Link>
                        <Card.Text>
                            {`${row.restaurant_info.address.line1} ${row.restaurant_info.address.line2}, ${row.restaurant_info.address.city}, ${row.restaurant_info.address.state_name} ${row.restaurant_info.address.zipcode}`}
                        </Card.Text>
                        <Accordion className="my-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>View order details</Accordion.Header>
                            <Accordion.Body>
                                {row.order_items.map(createDishItemRow)}
                                <Row className="mt-4">
                                    <Col xs={1}></Col>
                                    <Col xs={9}> Total amount: </Col>

                                    <Col xs={2}> {`$${row.total_amount}`} </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        </Accordion>
                        <Row className="my-3 mx-2">
                            Special instructions: {row.specialInstructions}
                        </Row>
                        <Row>
                            <Col xs={4}>
                                {/* <Button variant="dark" value="5" onClick={this.orderStatusChangeHandler}>Update order status</Button> */}
                                {(
                                    row.order_status==="placed" 
                                    ?<Button id={row.order_ID} variant="dark" value="cancelled" onClick={this.orderStatusChangeHandler}>Cancel order</Button>
                                    :<Button variant="dark" disabled>Cancel order</Button>
                                )}
                            </Col>
                            <Col xs={4}>
                                <Link to={`/restaurants/${row.restaurant_info.restaurant_ID}`} style={{ textDecoration: 'none' }}>
                                    <Button variant="dark">View Restaurant</Button>
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                    </Card>
                </Col>
            )
        }
        const createPageNumberButtons = obj => {
            return (
                <Pagination.Item key={obj.pageNumber} active={obj.isHighlighted} onClick={this.paginationButtonClickHandler}>
                    {obj.pageNumber}
                </Pagination.Item>
            )
        }
        return(
            <Container fluid>
                {redirectVar}
                <Navbar/>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <Row className="m-4">
                    <Col xs={9}>
                      <Container>
                          <Row>
                              <p className="display-6">My Orders</p>
                          </Row>
                          <Container className="my-5">
                                <Row className="my-4">
                                    <Col xs={6}>
                                        <Form.Select onChange={this.selectedOrderFilterChangeHandler}>
                                        <option value="all">All orders</option>
                                            <option value="placed">New orders</option>
                                            <option value="preparing">Preparing orders</option>
                                            <option value="delivered">Delivered orders</option>
                                            <option value="cancelled">Cancelled orders</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={1}></Col>
                                    <Col xs={1}>
                                        <Form.Select onChange={this.paginationLimitChangeHandler} defaultValue="5">
                                            <option value="2">2</option>
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    {(this.state.fetchedOrders.length ? this.state.fetchedOrders.map(createOrderRow) : "")}
                                </Row>
                                <Row className="mx-5 mt-3 px-5">
                                    <Pagination className="mx-5  px-5" size="lg">
                                        {this.state.pageNumbers.map(createPageNumberButtons)}
                                    </Pagination>
                                </Row>
                            </Container>
                      </Container>
                    </Col>
                </Row>
            </Container>
        )
    }
}



//export Login Component
export default CustomerOrders;