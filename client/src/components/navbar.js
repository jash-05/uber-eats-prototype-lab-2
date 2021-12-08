import React, {Component} from 'react';
import './../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import FormControl from 'react-bootstrap/FormControl'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CloseButton from 'react-bootstrap/CloseButton';
import {withRouter} from 'react-router-dom';
import server_IP from '../config/server.config.js';
import Modal from 'react-bootstrap/Modal';
import { connect } from 'react-redux'
import { update_quantity, delete_item, clear_cart, update_total_amount} from '../redux'

// Define a Login Component
class DashboardNavbar extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: this.props.restaurant_ID,
            authFlag : false,
            showSideMenu: false,
            profile_picture: "",
            first_name: "",
            showModal: false,
            changeRoute: ""
        }
        //Bind the handlers to this class
        this.toggleSideMenu = this.toggleSideMenu.bind(this);
        this.fetchCustomerDetails = this.fetchCustomerDetails.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.fetchCustomerDetails();
    }
    fetchCustomerDetails = async () => {
        if (localStorage.getItem('customer')) {
            try {
                const response = await axios.get(`http://${server_IP}:3001/customers/${localStorage.getItem('customer')}`);
                console.log(response.data)
                this.setState({
                    profile_picture: response.data.profile_picture,
                    first_name: response.data.first_name
                })
            } catch (err) {
                console.error(err);
            }
        }
    }
    toggleSideMenu = () => {
        this.setState({
            showSideMenu: !this.state.showSideMenu
        })
    }
    searchHandler = async (e) => {
        e.preventDefault();
        console.log(e)
        console.log(e.target.firstChild.value);
        this.setState({
            changeRoute: `/searchResults/${e.target.firstChild.value}`
        })
        // window.location.reload(false);
    } 
    handleLogout = () => {
        console.log(localStorage.getItem('customer'))
        console.log('Removing customer JWT from local storage')
        localStorage.clear();
        console.log(localStorage.getItem('customer'))
        this.setState({
            changeRoute: '/welcomeUser'
        })
        // this.props.history.push('/welcomeUser')
        // window.location.reload(false);
    }
    updateQuantityBeforeCheckout = async (e) => {
        console.log('updating quantity before checkout')
        let dish_ID = e.target.id
        let change_in_quantity = 0
        if (e.target.innerText === "+"){
            change_in_quantity = 1
        } else {
            change_in_quantity = -1
        }
        const payload = {
            restaurant_ID: this.props.restaurant_ID,
            dish_ID: dish_ID,
            change_in_quantity: change_in_quantity            
        }
        console.log(payload)
        this.props.call_update_quantity(payload)
        this.updateTotalAmount()
        this.setState({})
    }
    updateTotalAmount = () => {
        let total_order_amount = this.props.dishes.reduce((prev, next) => prev + next.quantity * next.price, 0);
        total_order_amount = Math.round(total_order_amount*100)/100
        this.props.call_update_total_amount({
            total_amount: total_order_amount
        })
    }
    viewOrder = () => {
        console.log("Inside view order function")
        this.updateTotalAmount();
        this.setState({
            showModal: !this.state.showModal
        })
    }
    closeModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }
    checkoutOrder = () => {
        console.log("Inside checkout order function")
        this.setState({
            showModal: !this.state.showModal
        })
    }
    render(){
        let redirectVar = ""
        if (this.state.changeRoute) {
            redirectVar = <Redirect to={this.state.changeRoute}/>
        }
        const createOrderItemRow = row => {
            return (
                <Row>
                    <Col xs={1}><Button id={row.dish_ID} onClick={this.updateQuantityBeforeCheckout} size="sm" variant="dark">-</Button></Col>
                    <Col xs={1} className="my-1"> {row.quantity} </Col>
                    <Col xs={1}><Button id={row.dish_ID} onClick={this.updateQuantityBeforeCheckout} size="sm" variant="dark">+</Button></Col>
                    <Col xs={7}> {row.dish_name} </Col>
                    <Col xs={2}> {`$${Math.round(row.quantity * row.price * 100)/100}`} </Col>
                </Row>
            )
        }
        return(
            <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
                {redirectVar}
                <Navbar expand="xxl" className="bg-light rounded">
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous"/>
                    <Container fluid className="px-5 py-3">
                    <Offcanvas show={this.state.showSideMenu} onHide={this.toggleSideMenu} style={{width: "25rem"}}>
                        <Offcanvas.Header className="my-3">
                        {/* <Offcanvas.Title>{(this.state.first_name ? this.state.first_name : "Default User")}</Offcanvas.Title> */}
                        <Col>
                        <Row>
                            <Col xs={10}></Col>
                            <Col xs={1}><CloseButton onClick={this.toggleSideMenu}/></Col>
                            <Col xs={1}></Col>
                        </Row>
                        <Row className="px-5">
                            <Image className="img-fluid" src={this.state.profile_picture} roundedCircle></Image>
                        </Row>
                        <Row className="mx-5 mt-4 mb-5 h4 px-5">
                            {`Hello, ${(this.state.first_name ? this.state.first_name : "User")}`}
                        </Row>
                        <Nav className="flex-column px-2">
                            <Nav.Link className="h5 text-dark my-1" href="/customerProfile"><i className="fas fa-user mx-4"></i>View account</Nav.Link>
                            <Nav.Link className="h5 text-dark my-1" href="/customerOrders"><i className="fas fa-bookmark mx-4"></i>Orders</Nav.Link>
                            <Nav.Link className="h5 text-dark my-1" href="/favourites"><i className="fas fa-heart mx-4"></i>Favourites</Nav.Link>
                        </Nav>
                        </Col>
                        </Offcanvas.Header>
                        {(
                            localStorage.getItem('customer')
                            ? <Button className="mx-5" variant="dark" size="md" onClick={this.handleLogout}>Logout</Button>
                            : <Link className="mx-5" to="/welcomeUser"><Button variant="dark" size="md">Login</Button></Link>
                        )}
                        <Offcanvas.Body>
                        {/* Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc. */}
                        </Offcanvas.Body>
                    </Offcanvas>
                    <Navbar.Brand>
                        <i className="fas fa-bars" onClick={this.toggleSideMenu}></i>
                        {/* <Button variant="primary" onClick={this.toggleSideMenu}>
                            Launch
                        </Button> */}
                        <Link to="/dashboard">
                        <Image
                            className="mx-5"
                            src="https://uber-eats-prototype.s3.us-west-1.amazonaws.com/logo.svg"
                            style={{height: "2rem"}}
                        ></Image>
                        </Link>
                    </Navbar.Brand>
                    <Nav>
                        <Form className="d-flex mx-5" onSubmit={this.searchHandler}>
                            <FormControl
                                type="search"
                                size="md"
                                placeholder="What are you craving?"
                                className="mx-2 px-4 py-1 border-0 border-bottom"
                                style = {{width: "30rem", backgroundColor: "#f6f6f6"}}
                            />
                            {/* <Button variant="outline-success">Search</Button> */}
                        </Form>
                        <Button variant="dark" size="md" onClick={this.viewOrder}
                        style={{borderRadius:"20px"}}>
                            Cart • {this.props.dishes ? this.props.dishes.length : 0}
                        </Button>
                    </Nav>
                    </Container>
                </Navbar>
                <Container className="m-5">
                        <Modal 
                            show={this.state.showModal} 
                            onHide={this.closeModal}
                            backdrop="static"
                            keyboard={false}
                            centered
                        >
                            <Modal.Header closeButton>
                            <Modal.Title>Current Order</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {this.props.dishes.map(createOrderItemRow)}
                                <Row className="mt-4">
                                    <Col xs={1}></Col>
                                    <Col xs={9}>Total amount:</Col>
                                    <Col xs={2}> {`$${this.props.total_amount}`} </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Link to={`/checkout/${this.props.restaurant_ID}`}>
                                    <Button className="mx-auto" variant="dark" onClick={this.checkoutOrder}>
                                        Go to checkout • {`$${this.props.total_amount}`}
                                    </Button>
                                </Link>
                            </Modal.Footer>
                        </Modal>
                    </Container>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
      restaurant_ID: state.cart.restaurant_ID,
      dishes: state.cart.dishes,
      total_amount: state.cart.total_amount
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        call_update_quantity: (x) => dispatch(update_quantity(x)),
        call_delete_item: (x) => dispatch(delete_item(x)),
        call_clear_cart: (x) => dispatch(clear_cart(x)),
        call_update_total_amount: (x) => dispatch(update_total_amount(x))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardNavbar);