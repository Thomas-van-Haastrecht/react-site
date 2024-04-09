import {fetchData} from './fetch'

// function to GET packaging type info from DB
export function getPackagingTypes () {
    return fetchData('https://localhost:7027/api/packagingtypes');
}

// function to POST a new packaging type to DB
export function postPackagingType (packagingJSON) {
    return fetch('https://localhost:7027/api/packagingtypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: packagingJSON,
    });
}

// function to update (PUT) an existing packaging type
export function putPackagingType ({id, packagingJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/packagingtypes/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: packagingJSON,
    });
}