import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import WelcomeUser from './welcome.user'
import CustomerLogin from './customer.login';
import CustomerRegister from './customer.register';
import RestaurantLogin from './restaurant.login';
import RestaurantRegister from './restaurant.register';
import Dashboard from './dashboard';
import RestaurantDetails from './restaurant.details';
import Checkout from './checkout';
import Navbar from './navbar';
import RestaurantProfile from './restaurant.profile';
import CustomerProfile from './customer.profile';
import SearchResults from './searchResult';
import Favourites from './favourites';
import CustomerOrders from './customer.orders';
import CustomerPublicProfile from './customer.public.profile';
import EditDish from './restaurant.editDish';
import CakeContainer from './CakeContainer';
import CartComponent from './cart.component';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                {/* <Route path="/" component={DashboardNavbar}/> */}
                <Route path="/welcomeUser" component={WelcomeUser}/>
                <Route path="/customerLogin" component={CustomerLogin}/>
                <Route path="/customerRegister" component={CustomerRegister}/>
                <Route path="/restaurantLogin" component={RestaurantLogin}/>
                <Route path="/restaurantRegister" component={RestaurantRegister}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/restaurants/:restaurant_ID" component={RestaurantDetails}/>
                <Route path="/checkout/:restaurant_ID" component={Checkout}/>
                <Route path="/navbar" component={Navbar}/>
                <Route path="/restaurantProfile" component={RestaurantProfile}/>
                <Route path="/customerProfile" component={CustomerProfile}/>
                <Route path="/searchResults/:searchQuery" component={SearchResults}/>
                <Route path="/favourites" component={Favourites}/>
                <Route path="/customerOrders" component={CustomerOrders} />
                <Route path="/customerPublicProfile/:customer_ID" component={CustomerPublicProfile} />
                <Route path="/editDish/:dish_ID" component={EditDish}/>
                <Route path="/cake" component={CakeContainer} />
                <Route path="/cart" component={CartComponent} />
            </div>
        )
    }
}



//Export The Main Component
export default Main;