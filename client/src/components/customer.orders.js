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
            filteredOrders: [],
            selectedOrderFilter: "all"
        }
        //Bind the handlers to this class
        this.fetchOrders = this.fetchOrders.bind(this);
        this.selectedOrderFilterChangeHandler = this.selectedOrderFilterChangeHandler.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.fetchOrders();
    }
    fetchOrders = async () => {
        try {
            console.log('Fetching dishes')
            const response = await axios.get(`http://${server_IP}:3001/fetchOrdersForCustomer`, {params:{customer_ID: cookie.load('customer')}})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request of fetching orders");
                console.log(response.data);
                this.setState({
                    fetchedOrders: response.data,
                    filteredOrders: response.data
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
    selectedOrderFilterChangeHandler = (e) => {
        let filter = e.target.value;
        console.log("Filter: ", filter)
        if (filter === "all"){
            this.setState({
                selectedOrderFilter: filter,
                filteredOrders: this.state.fetchedOrders
            })
        } else {
            let filteredOrders = []
            for(let i=0;i<this.state.fetchedOrders.length;i++) {
                if (this.state.fetchedOrders[i].order_status === filter) {
                    filteredOrders.push(this.state.fetchedOrders[i])
                }
            }
            this.setState({
                selectedOrderFilter: filter,
                filteredOrders: filteredOrders
            })
        }
    }
    render(){
        console.log("Rendering")
        console.log(this.state.filteredOrders)
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
                <Col className="m-3">
                    <Card style={{width: "40rem"}}>
                    <Card.Header>
                        <Row className="p-1">
                        <Col xs={7}>
                            Status: <strong>{capitalizeFirstLetter(((row.order_status==="placed") ? "New Order" : (row.order_status==="cancelled" ? "Preparing" : row.order_status)))}</strong>
                        </Col>
                        <Col xs={3}>
                            Order # {row.order_ID}
                        </Col>
                        <Col xs={2}>
                            {`$${row.total_amount ? row.total_amount : ""}`}
                        </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Link to={`/restaurants/${row.restaurant_ID}`} style={{ textDecoration: 'none' }}>
                            <Card.Title className="text-dark">{`${row.restaurant_name}`}</Card.Title>
                        </Link>
                        <Card.Text>
                            {`${row.line1} ${row.line2}, ${row.city}, ${row.state_name} ${row.zipcode}`}
                        </Card.Text>
                        <Accordion className="my-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>View order details</Accordion.Header>
                            <Accordion.Body>
                                {formatDishes(row.dish_IDs.split(','), row.dish_names.split(','), row.dish_prices.split(','), row.dish_quantities.split(',')).map(createDishItemRow)}
                                <Row className="mt-4">
                                    <Col xs={1}></Col>
                                    <Col xs={9}> Total amount: </Col>

                                    <Col xs={2}> {`$${row.total_amount}`} </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                        </Accordion>
                        <Row>
                            <Col xs={4}>
                                <Link to={`/restaurants/${row.restaurant_ID}`} style={{ textDecoration: 'none' }}>
                                    <Button variant="dark">View Restaurant</Button>
                                </Link>
                            </Col>
                        </Row>                        
                    </Card.Body>
                    </Card>
                </Col>
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
                                    <Form.Select onChange={this.selectedOrderFilterChangeHandler}>
                                        <option value="all">All orders</option>
                                        <option value="placed">New orders</option>
                                        <option value="delivered">Delivered orders</option>
                                        <option value="cancelled">Preparing orders</option>
                                    </Form.Select>
                                </Row>
                                <Row>
                                    {(this.state.filteredOrders.length ? this.state.filteredOrders.map(createOrderRow) : "")}
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