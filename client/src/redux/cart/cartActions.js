import {  UPDATE_QUANTITY, DELETE_ITEM, CLEAR_CART, UPDATE_TOTAL_AMOUNT } from './cartTypes';

export const update_quantity = (data) => {
    return {
        type: UPDATE_QUANTITY,
        payload: data
    }
}

export const delete_item = (data) => {
    return {
        type: DELETE_ITEM,
        payload: data
    }
}

export const clear_cart = (data) => {
    return {
        type: CLEAR_CART,
        payload: data
    }
}

export const update_total_amount = (data) => {
    return {
        type: UPDATE_TOTAL_AMOUNT,
        payload: data
    }
}