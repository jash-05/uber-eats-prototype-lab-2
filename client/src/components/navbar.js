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

// Define a Login Component
class DashboardNavbar extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            authFlag : false,
            showSideMenu: false,
            profile_picture: "",
            first_name: "",
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
        if (cookie.load('customer')) {
            try {
                const response = await axios.get(`http://${server_IP}:3001/customers/${cookie.load('customer')}`);
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
        console.log(e.target.firstChild.value);
        this.props.history.push(`/searchResults/${e.target.firstChild.value}`)
        window.location.reload(false);
    } 
    handleLogout = () => {
        console.log(cookie.load('customer'))
        console.log('Removing customer cookie')
        cookie.remove('customer');
        console.log(cookie.load('customer'))
        window.location.reload(false);
    }
    render(){
        return(
            <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
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
                        {(
                            cookie.load('customer')
                            ? <Button variant="dark" size="md" onClick={this.handleLogout}>Logout</Button>
                            : <Link to="/welcomeUser"><Button variant="dark" size="md">Login</Button></Link>
                        )}
                    </Nav>
                    </Container>
                </Navbar>
            </Container>
        )
    }
}
//export Login Component
export default withRouter(DashboardNavbar);