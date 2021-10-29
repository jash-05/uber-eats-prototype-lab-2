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

export {handleUpdateQuantity};