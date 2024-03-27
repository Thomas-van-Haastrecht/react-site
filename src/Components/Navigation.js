import { useState } from "react";
import NavTabs from './NavTabs';
import UserList from '../Tabs/UserList';
import RecipeList from '../Tabs/RecipeList';
import ProductList from '../Tabs/ProductList';
import CommentList from '../Tabs/CommentList';
import EventList from '../Tabs/EventList';

// renders navigation list and the selected tab
const Navigation = () => {
    const tabs = ['Users', 'Recipes', 'Products', 'Comments', 'Events']
    const [activeTab, setActiveTab] = useState(0);

    // state for the active component (used in their respective tabs)
    // lifted up so links in other tabs can redirect easily
    const [activeRecipe, setActiveRecipe] = useState(0);
    const [activeComment, setActiveComment] = useState(0);

    //function to change the active tab as specified
    function handleTabChange(tabName) {
        const index = tabs.indexOf(tabName);
        setActiveTab(index);
        setActiveComment(0);
        setActiveRecipe(0);
    }

    // function to fetch GET request (used in each list component, so it resides here to avoid repetition)
    // url   - url to fetch from
    function fetchData (url) {
        return new Promise( (resolve, reject) => {
            fetch(url) 
                .then(response => response.json())
                .then(result => {
                    resolve(result)
                })
                .catch(err => {reject(err)})
        })
    }

    return (
        <>
            <NavTabs list={tabs} update={handleTabChange} active={activeTab}/>
            {
                { //workaround for switch statement
                    'Users': <UserList fetchData={fetchData} handleTabChange={handleTabChange} setActiveRecipe={setActiveRecipe} />,
                    'Recipes': <RecipeList fetchData={fetchData} activeRecipe={activeRecipe} setActiveRecipe={setActiveRecipe} />,
                    'Products': <ProductList fetchData={fetchData} />,
                    'Comments': <CommentList fetchData={fetchData} activeComment={activeComment} setActiveComment={setActiveComment} />,
                    'Events': <EventList fetchData={fetchData} />
                }[tabs[activeTab]]
            }
        </>
    )
}

export default Navigation;