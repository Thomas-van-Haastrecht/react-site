import {fetchData} from './fetch'

// function to GET recipe info from DB
export function getRecipes () {
    return fetchData('https://localhost:7027/api/recipes');
}

// function to update (PUT) an existing recipe
export function putRecipe ({id, recipeJSON}) { // destructoring necessary as react-query mutate functions only take one input
    return fetch('https://localhost:7027/api/recipes/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: recipeJSON,
    });
}