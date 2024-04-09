import { useState } from "react";
import NavTabs from './NavTabs';
import UserList from '../Tabs/UserList';
import RecipeList from '../Tabs/RecipeList';
import ProductList from '../Tabs/ProductList';
import CommentList from '../Tabs/CommentList';
import EventList from '../Tabs/EventList';
import KitchenTypes from "../Tabs/KitchenTypes";
import PackagingTypes from "../Tabs/PackagingTypes";
import IngredientTypes from "../Tabs/IngredientTypes";

// renders navigation list and the selected tab
const Navigation = () => {
    const tabs = ['Users', 'Recipes', 'Products', 'Comments', 'Events', 'Kitchen Types', 'Packaging Types', 'Ingredient Types']
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

    // wrapper function to change to a recipe page (this way only one function needs to be passed down to SelectedUser)
    // i   - index of the recipe to be made active
    function moveToRecipe(i) {
        handleTabChange('Recipes')
        setActiveRecipe(i)
    }

    // wrapper function to change to a comment page (this way only one function needs to be passed down to SelectedUser)
    // i   - index of the comment to be made active
    function moveToComment(i) {
        handleTabChange('Comments')
        setActiveComment(i)
    }

    return (
        <>
            <NavTabs list={tabs} update={handleTabChange} active={activeTab}/>
            {
                { //workaround for switch statement
                    'Users': <UserList moveToComment={moveToComment} moveToRecipe={moveToRecipe} />,
                    'Recipes': <RecipeList activeRecipe={activeRecipe} setActiveRecipe={setActiveRecipe} moveToComment={moveToComment} />,
                    'Products': <ProductList />,
                    'Comments': <CommentList activeComment={activeComment} setActiveComment={setActiveComment} />,
                    'Events': <EventList />,
                    'Kitchen Types': <KitchenTypes />,
                    'Packaging Types': <PackagingTypes />,
                    'Ingredient Types': <IngredientTypes />
                }[tabs[activeTab]]
            }
        </>
    )
}

export default Navigation;