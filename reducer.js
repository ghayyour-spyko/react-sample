import * as ActionTypes from '../constants/Product';

export const productReducer = (state = { all: [], categories: [], shirt: null, color: null }, action) => {
    switch (action.type) {
        case ActionTypes.GET_PRODUCTS_SUCCESS:
            return (state.shirt ? state : action.payload.records.product);
        case ActionTypes.CHANGE_PRODUCT:
            return { ...state, shirt: action.payload };
        default:
            return state;
    }
};
