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
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import HeartCheckbox from 'react-heart-checkbox';
import Navbar from './navbar'
import server_IP from '../config/server.config.js';
import Form from 'react-bootstrap/Form';

// Define a Login Component
class Dashboard extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            fetchedRestaurants: [],
            filteredRestaurants: [],
            location: "",
            vegetarian: false,
            non_vegetarian: false,
            vegan: false,
            delivery: true,
            pickup: false,
            authFlag : false,
            city: ""
        }
        //Bind the handlers to this class
        this.vegetarianChangeHandler = this.vegetarianChangeHandler.bind(this);
        this.nonVegetarianChangeHandler = this.nonVegetarianChangeHandler.bind(this);
        this.veganChangeHandler = this.veganChangeHandler.bind(this);
        this.deliveryOptionsChangeHandler = this.deliveryOptionsChangeHandler.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        this.fetchRestaurants(data);
    }
    cityChangeHandler = async (e) => {
        const data  = {
            vegetarian: !this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            await this.fetchRestaurants(data);
            this.setState({
                city: e.target.value
            })
        } catch(err) {
            console.error(err);
        }
    }
    filterRestaurants = (data, fetchedRestaurants=this.state.fetchedRestaurants) => {
        console.log('Filtering restaurants with the following filters: ')
        let filteredRestaurants = []
        for (let i=0; i<fetchedRestaurants.length; i++) {
            const r = fetchedRestaurants[i]
            if (!(data.vegetarian || data.non_vegetarian || data.vegan)) {
                if ((data.delivery && r.delivery) || (data.pickup && r.pickup)) {
                    filteredRestaurants.push(r)
                }
            }
            else if ((data.vegetarian && r.vegetarian) || (data.non_vegetarian && r.non_vegetarian) || (data.vegan && r.vegan)) {
                if ((data.delivery && r.delivery) || (data.pickup && r.pickup)) {
                    filteredRestaurants.push(r)
                }
            }
        }
        return filteredRestaurants
    }
    vegetarianChangeHandler = async (e) => {
        const data  = {
            vegetarian: !this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            const filteredRestaurants = this.filterRestaurants(data)
            this.setState({
                vegetarian: !this.state.vegetarian,
                filteredRestaurants: filteredRestaurants
            })
        } catch(err) {
            console.error(err);
        }
    }
    nonVegetarianChangeHandler = async (e) => {
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: !this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            const filteredRestaurants = this.filterRestaurants(data)
            this.setState({
                non_vegetarian: !this.state.non_vegetarian,
                filteredRestaurants: filteredRestaurants
            })
        } catch(err) {
            console.error(err);
        }
    }
    veganChangeHandler = async (e) => {
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: !this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            const filteredRestaurants = this.filterRestaurants(data)
            this.setState({
                vegan: !this.state.vegan,
                filteredRestaurants: filteredRestaurants
            })
        } catch(err) {
            console.error(err);
        }
    }
    deliveryOptionsChangeHandler = async (e) => {
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: e,
            pickup: !e
        }
        try {
            const filteredRestaurants = this.filterRestaurants(data)
            this.setState({
                delivery: e,
                pickup: !e,
                filteredRestaurants: filteredRestaurants
            })
        } catch(err) {
            console.error(err);
        }
    }
    getCityFromCustomerID = async (customer_ID) => {
        try {
            console.log('Fetching city')
            const response = await axios.get(`http://${server_IP}:3001/city/${customer_ID}`);
            this.setState({
                city: response.data.city
            })
            console.log('Fetched city: ', response.data.city)
        } catch (err) {
            console.error(err);
        }
    }
    getFavouritesForCustomer = async (customer_ID) => {
        try {
            console.log('Fetching customer favourites')
            axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
            const response = await axios.get(`http://${server_IP}:3001/favourites/${customer_ID}`);
            console.log(response.data);
            let favourite_restaurants = []
            for (let i=0;i<response.data.length;i++){
                favourite_restaurants.push(response.data[i].restaurant_ID);
            }
            return favourite_restaurants
        } catch (err) {
            console.error(err);
            return []
        }
    }
    fetchRestaurants = async () => {
        if (localStorage.getItem('customer') && !(this.state.city)) {
            await this.getCityFromCustomerID(localStorage.getItem('customer'))
        }
        let favourite_restaurants = [];
        if (localStorage.getItem('customer')){
            favourite_restaurants = await this.getFavouritesForCustomer(localStorage.getItem('customer'))
        }
        console.log(favourite_restaurants)
        let restaurantData = []
        try {
            let payload = {city: this.state.city, customer_ID: localStorage.getItem('customer')}
            const response = await axios.get(`http://${server_IP}:3001/restaurants`, {params: payload})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request for fetching restaurants");
                console.log(response.data);
                for (let i=0;i < response.data.length; i++){
                    restaurantData.push({
                        'restaurant_ID': response.data[i].restaurant_ID,
                        'restaurant_name': response.data[i].restaurant_name,
                        'cover_image': response.data[i].cover_image,
                        'city': response.data[i].city,
                        'favourite': favourite_restaurants.includes(response.data[i].restaurant_ID),
                        'vegetarian': response.data[i].vegetarian,
                        'non_vegetarian': response.data[i].non_vegetarian,
                        'vegan': response.data[i].vegan,
                        'delivery': response.data[i].delivery,
                        'pickup': response.data[i].pickup
                    });
                    console.log(restaurantData)
                }
                this.setState({
                    fetchedRestaurants: restaurantData,
                    filteredRestaurants: restaurantData
                })
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    favouritesHandler = async (e) => {
        let restaurants = []
        for(let i=0;i<this.state.fetchedRestaurants.length;i++){
            if ((this.state.fetchedRestaurants[i].restaurant_ID === e.target.id) && (localStorage.getItem('customer'))){
                try {
                    axios.defaults.withCredentials = true;
                    if (!this.state.fetchedRestaurants[i].favourite){
                        let data = {
                            customer_ID: localStorage.getItem('customer'),
                            restaurant_ID: this.state.fetchedRestaurants[i].restaurant_ID
                        }
                        console.log(data)
                        console.log('Sending request to add favourite restaurant')
                        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
                        axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
                        const response = await axios.post(`http://${server_IP}:3001/favourites`, data)
                        console.log(response.data);
                    } else {
                        console.log('Sending request to delete favourite restaurant')
                        const response = await axios.delete(`http://${server_IP}:3001/favourites/${localStorage.getItem('customer')}/${this.state.fetchedRestaurants[i].restaurant_ID}`)
                        console.log(response.data)
                    }
                    restaurants.push({...this.state.fetchedRestaurants[i], favourite: !this.state.fetchedRestaurants[i].favourite})
                } catch (err) {
                    console.error(err);
                }
            } else {
                restaurants.push(this.state.fetchedRestaurants[i])
            }
        }
        const filters  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        const filteredRestaurants = this.filterRestaurants(filters, restaurants)
        this.setState({
            fetchedRestaurants: restaurants,
            filteredRestaurants: filteredRestaurants
        })
    }
    render(){
        sessionStorage.setItem("order_type", (this.state.delivery ? "delivery" : "pickup"));
        // console.log(this.state.fetchedRestaurants)
        const createCard = card => {
            return (
                <Col sm={3} className="ml-3 mt-3"  style={{ width: '25rem'}}>
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
        let veg_btn_variant = this.state.vegetarian ? "dark" : "light";
        let non_veg_btn_variant = this.state.non_vegetarian ? "dark" : "light";
        let vegan_btn_variant = this.state.vegan ? "dark" : "light";

        return(
            <Container fluid style={{backgroundImage: `url('https://images.unsplash.com/photo-1520074881623-f6cc435eb449?ixlib=rb-1.2.1')`, height:"100vh", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
                <Navbar/>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <Row className="m-4">
                    <Col xs={3} >
                        <Container className="my-5">
                            <Row>
                                <p className="h4">Food options</p>
                            </Row>
                            <Row>
                                <Button onClick={this.vegetarianChangeHandler} className="m-2" variant={veg_btn_variant}>Vegetarian</Button>
                                <Button onClick={this.nonVegetarianChangeHandler} className="m-2" variant={non_veg_btn_variant}>Non-vegetarian</Button>
                                <Button onClick={this.veganChangeHandler} className="m-2" variant={vegan_btn_variant}>Vegan</Button>
                            </Row>
                        </Container>
                        <Container className="my-5">
                            <Row>
                                <p className="h4">Select delivery option</p>
                                {/* <p className="h6">(Click to toggle)</p> */}
                            </Row>
                            <Row>
                                <BootstrapSwitchButton 
                                    checked={this.state.delivery}
                                    onlabel='Delivery'
                                    offlabel='Pickup'
                                    onChange={this.deliveryOptionsChangeHandler}
                                />
                            </Row>
                        </Container>
                        <Container className="my-5">
                            <Row>
                                <p className="h4">Search by location</p>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Control onChange={this.cityChangeHandler} defaultValue={this.state.city}/>
                                </Form.Group>
                            </Row>
                        </Container>
                    </Col>
                    <Col xs={9}>
                      <Container>
                          <Row className="display-6 my-2" style={{fontSize: "1.5rem"}}>
                                {(this.state.city ? `Higher preference given to restaurants of ${this.state.city}` : "")}
                          </Row>
                          <Row>
                          {this.state.filteredRestaurants.map(createCard)}
                          </Row>
                      </Container>
                    </Col>
                </Row>
            </Container>
        )
    }
}



//export Login Component
export default Dashboard;