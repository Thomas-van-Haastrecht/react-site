import {fetchData} from './fetch'

// function to GET allergy info from DB
export function getEvents () {
    return fetchData('https://localhost:7027/api/events');
}

// function to POST a new product to DB
export function postEvent (eventJSON) {
    return fetch('https://localhost:7027/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: eventJSON,
    });
}

// function to update (PUT) an existing product
export function putEvent ({id, eventJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/events/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: eventJSON,
    });
}