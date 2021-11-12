import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Link, Redirect } from 'react-router-dom';
import Navbar from './navbar';
import server_IP from '../config/server.config.js';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux'
import { update_quantity, delete_item, clear_cart, update_total_amount} from '../redux'

// Define a Login Component
class RestaurantDetails extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: props.match.params.restaurant_ID,
            customer_ID: cookie.load('customer'),
            restaurant_name: "",
            short_address: "",
            cover_image: "",
            about: "",
            full_adress: "",
            fetchedDishes: [],
            showModal: false,
            showConfirmationModal: false,
            new_dish: {},
            isFavourite: false
        }
        //Bind the handlers to this class
        this.updateQuantityHandler = this.updateQuantityHandler.bind(this);
        this.fetchRestaurantDetails = this.fetchRestaurantDetails.bind(this);
        this.fetchDishes = this.fetchDishes.bind(this);
        this.viewOrder = this.viewOrder.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.checkoutOrder = this.checkoutOrder.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        // if (!cookie.load('customer')){
        //     this.props.history.push(`/welcomeUser`)
        // }
        this.fetchRestaurantDetails();
        this.fetchDishes();
        this.checkIfFavourite();
    }
    checkIfFavourite = async () => {
        try {
            console.log('Fetching customer favourites')
            const response = await axios.get(`http://${server_IP}:3001/favourites/${cookie.load('customer')}`);
            console.log(response.data);
            for (let i=0;i<response.data.length;i++){
                if (response.data[i].restaurant_ID === parseInt(this.state.restaurant_ID)) {
                    this.setState({
                        isFavourite: true
                    })
                    break;
                }
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }
    favouritesHandler = async (e) => {
        console.log(e) 
        let data = {
            customer_ID: this.state.customer_ID,
            restaurant_ID: this.state.restaurant_ID
        }
        if (e.target.className === "heart fa fa-heart-o fa-2x"){
            console.log('adding to favourites')
            console.log(data)
            console.log('Sending request to add favourite restaurant')
            const response = await axios.post(`http://${server_IP}:3001/favourites`, data)
            console.log(response.data);
        } else {
            console.log('removing from favourites')
            console.log('Sending request to delete favourite restaurant')
            const response = await axios.delete(`http://${server_IP}:3001/favourites/${this.state.customer_ID}/${this.state.restaurant_ID}`)
            console.log(response.data)
        }
        this.setState({
            isFavourite: !this.state.isFavourite
        })
    }
    updateQuantityHandler = async (e) => {
        console.log("Update quantity handler")
        let dish_ID = e.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].data
        let dish_name = e.target.parentNode.parentNode.parentNode.previousSibling.childNodes[0].innerText
        let price = parseFloat(e.target.parentNode.parentNode.parentNode.previousSibling.childNodes[2].innerText.slice(1))
        let change_in_quantity = 0
        if (e.target.innerText === "+"){
            change_in_quantity = 1
        } else {
            change_in_quantity = -1
        }
        const payload = {
            restaurant_ID: this.state.restaurant_ID,
            dish_ID: dish_ID,
            dish_name: dish_name,
            price: price,
            change_in_quantity: change_in_quantity            
        }
        if (!this.props.restaurant_ID || this.state.restaurant_ID === this.props.restaurant_ID) {
            this.props.call_update_quantity(payload)
            this.setState({
                showConfirmationModal: false
            })
        } else {
            this.setState({
                new_dish: payload,
                showConfirmationModal: true
            })
        }
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
            restaurant_ID: this.state.restaurant_ID,
            dish_ID: dish_ID,
            change_in_quantity: change_in_quantity            
        }
        console.log(payload)
        this.props.call_update_quantity(payload)
        this.updateTotalAmount()
        this.setState({})
    }
    fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`http://${server_IP}:3001/restaurants/${this.state.restaurant_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request for fetching restaurant details");
                console.log(response.data);
                this.setState({restaurant_name: response.data.restaurant_name});
                this.setState({
                    short_address: `${response.data.address.line1} ${response.data.address.line2}`
                });
                this.setState({
                    full_address: `${response.data.address.line1} ${response.data.address.line2}, ${response.data.address.city}, ${response.data.address.state_name} ${response.data.address.zipcode}`
                })
                this.setState({cover_image: response.data.cover_image});
                this.setState({about: response.data.about});
                console.log('Cookie status: ', cookie.load('cookie'));
                console.log('Completed fetch restaurant details functions')
                console.log(this.state)
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    fetchDishes = async () => {
        let dishesData = [] 
        try {
            const response = await axios.get(`http://${server_IP}:3001/dish`, {params:{restaurant_ID: this.state.restaurant_ID}})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request for fetching dishes");
                console.log(response.data);
                for (let i=0;i < response.data.dishes.length; i++){
                    let main_ingredients = response.data.dishes[i].main_ingredients;
                    if ((main_ingredients) && (main_ingredients.length > 20)) {
                        main_ingredients = main_ingredients.slice(0,80).concat('...')
                    }
                    dishesData.push({
                        'dish_ID': response.data.dishes[i].dish_ID,
                        'dish_name': response.data.dishes[i].dish_name,
                        'category_ID': response.data.dishes[i].category_ID,
                        'main_ingredients': main_ingredients,
                        'price': response.data.dishes[i].price,
                        'about': response.data.dishes[i].about,
                        "dish_image": response.data.dishes[i].dish_image,
                        "quantity": 0
                    });
                }
                this.setState({
                    fetchedDishes: dishesData
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
    closeConfirmationModal = () => {
        this.setState({
            showConfirmationModal: !this.state.showConfirmationModal
        })
    }
    createNewOrder = async () => {
        console.log("Inside checkout order function")
        this.props.call_clear_cart();
        this.props.call_update_quantity(this.state.new_dish);
        this.setState({
            showConfirmationModal: !this.state.showConfirmationModal
        })
    }
    render(){
        console.log("Rendering");
        let redirectVar = null;
        if (!cookie.load('customer')){
            redirectVar = <Redirect to="/welcomeUser"/>
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
        const createCard = card => {
            return (
                <Col sm={3} className="m-3  border"  style={{ width: '32rem', height:'12rem'}}>
                    <Row className="p-2">
                        <Col xs={9} md={8}>
                            <Row className="h5 mt-2 mb-4">{card.dish_name}</Row>
                            <Row className="text-muted">{card.main_ingredients}</Row>
                            <Row className="my-4 px-2">${card.price}</Row>
                        </Col>
                        <Col xs={3} md={4}>
                            <Image src={card.dish_image} className="img-fluid" style={{height: '8rem'}} />
                            <Row className="mt-1">
                                <Col>
                                    <Button onClick={this.updateQuantityHandler} size="md" variant="dark">-</Button>
                                </Col>
                                <Col className="h6 my-auto">
                                    <Form.Label visuallyHidden>{card.dish_ID}</Form.Label>
                                    {/* {card.quantity} */}
                                    {console.log('e')}
                                    {console.log(this.props.dishes.filter(dish => dish.dish_ID === card.dish_ID).length)}
                                    {console.log(this.props.dishes)}
                                    {/* {console.log(this.props.dishes.find(dish => dish.dish_ID === card.dish_ID).quantity)} */}
                                    {(this.props.dishes.filter(dish => dish.dish_ID === card.dish_ID).length ? this.props.dishes.find(dish => dish.dish_ID === card.dish_ID).quantity : 0)}
                                </Col>
                                <Col>
                                    <Button onClick={this.updateQuantityHandler} size="md" variant="dark">+</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                  </Col>
            )
        }
        return(
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                {redirectVar}
                <Navbar/>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <Container fluid style={{ paddingLeft: 0, paddingRight: 0}}>
                    <Row>
                        <Col>
                            <Image className="" src={this.state.cover_image} fluid style={{ width: "100vw", height:"20rem", objectFit:'cover'}}></Image>
                        </Col>
                    </Row>
                    <Row className="my-4 mx-5">
                        <Col xs={10} className="display-6">
                        {`${this.state.restaurant_name} (${this.state.short_address})`}
                        </Col>
                        <Col xs={1} className="">
                            <i className={this.state.isFavourite ? "heart fa fa-heart fa-2x" : "heart fa fa-heart-o fa-2x"} onClick={this.favouritesHandler} style={{color:"red"}}></i>
                        </Col>
                        <Col xs={1} className="">
                            <Button variant="dark" onClick={this.viewOrder}>
                                View Cart
                            </Button>
                        </Col>
                    </Row>
                    <Row className="lead mx-5 px-3">
                        {`${this.state.about}`}
                    </Row>
                    <Row className="my-2 lead mx-5 px-3">
                        {`${this.state.full_address}`}
                    </Row>
                </Container>                
                <Container className="m-5">
                    <Modal 
                        show={this.state.showConfirmationModal} 
                        onHide={this.closeConfirmationModal}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header closeButton style={{borderBottom: "0 none"}}>
                        <Modal.Title className="display-6 mx-2">Create new order?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="mx-2">
                                Your order contains items from a different restaurant. Create a new order to add items from this restaurant
                            </Row>
                        </Modal.Body>
                        <Modal.Footer style={{borderTop: "0 none"}}>
                            <Button className="mx-auto mb-4" style={{width: "25rem"}} variant="dark" onClick={this.createNewOrder}>
                                New Order
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
                            <Link to={`/checkout/${this.state.restaurant_ID}`}>
                                <Button className="mx-auto" variant="dark" onClick={this.checkoutOrder}>
                                    Go to checkout • {`$${this.props.total_amount}`}
                                </Button>
                            </Link>
                        </Modal.Footer>
                    </Modal>
                </Container>
                <Container fluid className="my-5 mx-5 px-5">
                    <Row>
                        {this.state.fetchedDishes.map(createCard)}
                    </Row>
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
)(RestaurantDetails);