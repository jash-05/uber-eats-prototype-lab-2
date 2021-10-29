import {  UPDATE_QUANTITY, DELETE_ITEM, CLEAR_CART, UPDATE_TOTAL_AMOUNT } from './cartTypes';
// import handleUpdateQuantity from './cartHelpers.js';

const handleUpdateQuantity = (state, action) => {
    if (action.payload.change_in_quantity === 1) {
        const target_index = state.dishes.findIndex((dish => dish.dish_ID === action.payload.dish_ID));
        let updated_dishes = state.dishes;
        if (target_index === -1) {
            updated_dishes.push({
                dish_ID: action.payload.dish_ID,
                dish_name: action.payload.dish_name,
                price: action.payload.price,
                quantity: 1
            })
        } else {
            updated_dishes[target_index].quantity += 1;
        }
        return {
            ...state,
            restaurant_ID: action.payload.restaurant_ID,
            dishes: updated_dishes
        }
    } else {
        if (state.dishes.length === 0) {
            return state;
        } else {
            const target_index = state.dishes.findIndex((dish => dish.dish_ID === action.payload.dish_ID));
            if (target_index === -1) {
                return state
            } else {
                let updated_dishes = state.dishes;
                if (state.dishes[target_index].quantity === 1) {
                    updated_dishes.splice(target_index, 1);
                } else {
                    updated_dishes[target_index].quantity -= 1
                }
                return {
                    ...state,
                    dishes: updated_dishes
                }
            }
        }
    }
}

const handleDeleteItem = (state, action) => {
    return {
        ...state,
        dishes: state.dishes.filter(dish => dish.dish_ID !== action.payload.dish_ID)
    }
}

const initialState = {
    restaurant_ID: null,
    dishes: [],
    total_amount: 0.0
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_QUANTITY: 
            return handleUpdateQuantity(state, action)
        case DELETE_ITEM: 
            return handleDeleteItem(state, action)
        case CLEAR_CART: 
            return {
                restaurant_ID: null,
                dishes: []
            };
        case UPDATE_TOTAL_AMOUNT:
            return {
                ...state,
                total_amount: action.payload.total_amount
            }
        default: 
            return state
    }
}

export default cartReducer;