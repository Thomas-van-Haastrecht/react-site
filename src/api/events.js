import {fetchData} from './fetch'

// function to GET event info from DB
export function getEvents () {
    return fetchData('https://localhost:7027/api/events');
}

// function to POST a new event to DB
export function postEvent (eventJSON) {
    return fetch('https://localhost:7027/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: eventJSON,
    });
}

// function to update (PUT) an existing event
export function putEvent ({id, eventJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/events/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: eventJSON,
    });
}

// function to DELETE an event
export function deleteEvent (id) {
    return fetch('https://localhost:7027/api/events/'+id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
}

// function to DELETE a participant from an event
export function deleteParticipant ({id, participantJSON}) {
    return fetch('https://localhost:7027/api/events/'+id+'/participants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: participantJSON,
    })
}