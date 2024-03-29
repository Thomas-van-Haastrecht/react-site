import {fetchData} from './fetch'

// function to GET packaging type info from DB
export function getPackagingTypes () {
    return fetchData('https://localhost:7027/api/packagingtypes');
}