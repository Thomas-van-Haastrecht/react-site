import {fetchData} from './fetch'

// function to GET product info from DB
export function getProducts () {
    return fetchData('https://localhost:7027/api/products');
}

// function to POST a new product to DB
export function postProduct (productJSON) {
    return fetch('https://localhost:7027/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: productJSON,
    });
}

// function to update (PUT) an existing product
export function putProduct ({id, productJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/products/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: productJSON,
    });
}

// function to GET ingredient type info from DB
export function getIngredientTypes () {
    return fetchData('https://localhost:7027/api/products/ingredienttypes');
}