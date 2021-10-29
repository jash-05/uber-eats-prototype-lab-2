import React, {Component} from 'react'
import { connect } from 'react-redux'
import { buyCake } from '../redux'
import { update_quantity, delete_item, clear_cart} from '../redux'

class CartComponent extends Component {
    constructor(props){
        super(props);
        this.state =  {
            cakesEaten: 1.5
        }
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <button onClick={() => this.props.call_update_quantity({
                    restaurant_ID: 1,
                    dish_ID: 1,
                    dish_name: "Veg Pulao",
                    price: 5.70,
                    change_in_quantity: 1
                })}> Increase quantity of dish 1</button>
                <button onClick={() => this.props.call_update_quantity({
                    restaurant_ID: 1,
                    dish_ID: 1,
                    dish_name: "Veg Pulao",
                    price: 5.70,
                    changed_in_quantity: -1
                })}> Decrease quantity of dish 1</button>
                <button onClick={() => this.props.call_update_quantity({
                    restaurant_ID: 1,
                    dish_ID: 2,
                    dish_name: "Veg Biryani",
                    price: 11.70,
                    change_in_quantity: 1
                })}> Increase quantity of dish 2</button>
                <button onClick={() => this.props.call_update_quantity({
                    restaurant_ID: 1,
                    dish_ID: 2,
                    dish_name: "Veg Pulao",
                    price: 11.70,
                    changed_in_quantity: -1
                })}> Decrease quantity of dish 2</button>
                <button onClick={() => this.props.call_delete_item({
                    dish_ID: 1
                })}> Delete dish 1 from cart</button>
                <button onClick={() => this.props.call_delete_item({
                    dish_ID: 2
                })}> Delete dish 2 from cart</button>
                <button onClick={() => this.props.call_clear_cart({
                })}> Clear cart</button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      restaurant_ID: state.cart.restaurant_ID,
      dishes: state.cart.dishes
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        call_update_quantity: (x) => dispatch(update_quantity(x)),
        call_delete_item: (x) => dispatch(delete_item(x)),
        call_clear_cart: (x) => dispatch(clear_cart(x)),
        call_buyCake: (x) => dispatch(buyCake(x))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartComponent)