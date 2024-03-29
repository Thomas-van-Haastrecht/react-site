import {fetchData} from './fetch'

// function to GET recipe info from DB
export function getRecipes () {
    return fetchData('https://localhost:7027/api/recipes');
}