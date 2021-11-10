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
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import HeartCheckbox from 'react-heart-checkbox';
import Navbar from './navbar';
import server_IP from '../config/server.config.js';

// Define a Login Component
class Favourites extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            favouriteRestaurants: [],
            city: ""
        }
        //Bind the handlers to this class
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.fetchFavouriteRestaurants();
    }
    fetchFavouriteRestaurants = async () => {
        if (!cookie.load('customer')){
            return []
        }
        try {
            console.log('Fetching customer favourites')
            const response = await axios.get(`http://${server_IP}:3001/favourites/${cookie.load('customer')}`);
            if (response.status===200){
                console.log("Successful request");
                console.log('Response')
                console.log(response.data);
                let favourite_restaurants = []
                for (let i=0;i<response.data.length;i++){
                    favourite_restaurants.push({
                        'restaurant_ID': response.data[i].restaurant_ID,
                        'restaurant_name': response.data[i].restaurant_name,
                        'cover_image': response.data[i].cover_image,
                        'city': response.data[i].city,
                        'favourite': true
                    });
                }
                this.setState({
                    favouriteRestaurants: favourite_restaurants
                })
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }
    favouritesHandler = async (e) => {
        let restaurants = []
        for(let i=0;i<this.state.favouriteRestaurants.length;i++){
            if ((this.state.favouriteRestaurants[i].restaurant_ID === e.target.id) && (cookie.load('customer'))){
                try {
                    axios.defaults.withCredentials = true;
                    console.log('Sending request to delete favourite restaurant')
                    const response = await axios.delete(`http://${server_IP}:3001/favourites/${cookie.load('customer')}/${this.state.favouriteRestaurants[i].restaurant_ID}`)
                    console.log(response.data)
                } catch (err) {
                    console.error(err);
                }
            } else {
                restaurants.push(this.state.favouriteRestaurants[i])
            }
        }
        this.setState({
            favouriteRestaurants: restaurants
        })
        console.log(restaurants)
    }
    render(){
        console.log("Rendering")
        console.log(this.state.filteredOrders)
        let redirectVar = null;
        if (!cookie.load('customer')){
            redirectVar = <Redirect to="/welcomeUser"/>
        }
        const createCard = card => {
            return (
                <Col sm={3} className="mx-3 my-4"  style={{ width: '25rem'}}>
                    <Card>
                    <Link to={`/restaurants/${card.restaurant_ID}`} style={{textDecoration: 'none'}}>
                    <Card.Img variant="top" src={card.cover_image} />
                    </Link>
                    <Card.Body>
                            <Row>
                            
                            <Col xs={10}>
                            <Link to={`/restaurants/${card.restaurant_ID}`} style={{textDecoration: 'none'}}>
                                <Card.Title className="text-dark">{card.restaurant_name}</Card.Title>
                                <Card.Text className="text-secondary">
                                    {card.city}
                                </Card.Text>
                                </Link>
                            </Col>
                            <Col xs={2}>
                                <i id={card.restaurant_ID} className={card.favourite ? "heart fa fa-heart fa-2x" : "heart fa fa-heart-o fa-2x"} onClick={this.favouritesHandler} style={{color:"red"}}></i>
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
                              <p className="display-6">My favourites</p>
                          </Row>
                          <Row>
                          {this.state.favouriteRestaurants.map(createCard)}
                          </Row>
                      </Container>
                    </Col>
                </Row>
            </Container>
        )
    }
}



//export Login Component
export default Favourites;