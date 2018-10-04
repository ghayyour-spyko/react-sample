import * as ActionTypes from '../constants/Product';
import { request, findAction } from '../../../middleware/dascommService';

export const getProduct = (Id) => {
    const { endpoint, method } = findAction('get-products-by-category');
    const options = { action: endpoint, method: method };

    options.body = {
        iCategoryId: Id
    };
    options.types = [
        ActionTypes.GET_PRODUCTS_SUCCESS,
        ActionTypes.GET_PRODUCTS_FAILED
    ];

    return request(options);
};

export const changeProduct = (product) => ({
    type: ActionTypes.CHANGE_PRODUCT,
    payload: product
});

export const changeColor = (color) => ({
    type: ActionTypes.CHANGE_COLOR,
    payload: color
});
