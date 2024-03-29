import {fetchData} from './fetch'

// function to GET allergy info from DB
export function getAllergies () {
    return fetchData('https://localhost:7027/api/allergies');
}