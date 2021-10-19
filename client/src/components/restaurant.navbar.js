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
class RestaurantNavbar extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            authFlag : false,
        }
        //Bind the handlers to this class
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
    }
    logoutHandler = () => {
        cookie.remove('restaurant');
        window.location.reload(false);
    }
    render(){
        return(
            <Container fluid style={{paddingLeft: 0, paddingRight: 0}}>
                <Navbar expand="xxl" className="bg-light rounded">
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous"/>
                    <Container fluid className="px-5 pt-3 pb-1">
                    <Navbar.Brand className="mx-5">
                        <Link to="/dashboard" style={{textDecoration: 'none'}}>
                        <Row>
                        <Image
                            src="https://uber-eats-prototype.s3.us-west-1.amazonaws.com/logo.svg"
                            style={{height: "2rem"}}
                        ></Image>
                        </Row>
                        <Row className="mx-5 mt-2" style={{color: '#21b53f'}}>for Restaurants</Row>
                        </Link>
                    </Navbar.Brand>
                    <Nav>
                        <Button variant="dark" size="md" onClick={this.logoutHandler}>Logout</Button>
                    </Nav>
                    </Container>
                </Navbar>
            </Container>
        )
    }
}
//export Login Component
export default withRouter(RestaurantNavbar);