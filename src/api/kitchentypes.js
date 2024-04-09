import {fetchData} from './fetch'

// function to GET kitchen type info from DB
export function getKitchenTypes () {
    return fetchData('https://localhost:7027/api/kitchentypes');
}

// function to POST a new kitchen type to DB
export function postKitchenType (kitchenJSON) {
    return fetch('https://localhost:7027/api/kitchentypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: kitchenJSON,
    });
}

// function to update (PUT) an existing kitchen type
export function putKitchenType ({id, kitchenJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/kitchentypes/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: kitchenJSON,
    });
}