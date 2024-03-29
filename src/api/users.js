import {fetchData} from './fetch'

// function to GET users info from DB
export function getUsers () {
    return fetchData('https://localhost:7027/api/users');
}

// function to GET a specific user's info from DB
export function getUser (id) {
    return fetchData('https://localhost:7027/api/users/'+id);
}

// function to update (PUT) an existing user
export function putUser ({id, userJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/users/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: userJSON,
    });
}

export function deleteUser (id) {
    return fetch('https://localhost:7027/api/users/'+id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
}