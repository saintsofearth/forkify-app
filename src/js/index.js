import Search from './models/Search'
import {elements, renderLoader, clearLoader} from './views/base'
import * as searchView from './views/searchView'
import Recipe from './models/Recipe'
import * as recipeView from './views/recipeView'
import List from './models/List'
import * as listView from './views/listView'
/*** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};
window.state = state;

/***Search Controller
 * 
 */
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput() // TODO
    // const query = 'pizza';
    // console.log(query);

    if(query) {
        // 2. New search object and add it to state
        state.search = new Search(query);

        // 3. Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            // 4. Search for recipes
            await state.search.getResults();
            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Something went wrong');
        }   
    }
}

elements.searchForm.addEventListener('submit', el => {
    el.preventDefault();
    controlSearch();
})


// TESTING
// window.addEventListener('load', el => {
//     el.preventDefault();
//     controlSearch();

// })

elements.searchResPages.addEventListener('click', el => {
    const btn = el.target.closest('.btn-inline');
    if(btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);
    }
});



/***Recipe Controller
 * 
 * 
 */

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

    console.log(id);

    if(id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // Create new recipe object
        state.recipe = new Recipe(id);

        if(state.search) {
            searchView.highlightedSelected(id); 
        }
        // TESTING
        // window.r = state.recipe;
        try {
            // Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        } catch (error) {
            alert('Error processing recipe');
        }
        // calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// Adding different event listener to same dom element
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// handling recipe btn click

elements.recipe.addEventListener('click', el => {
    if(event.target.matches('.btn-decrease, .btn-decrease *')) {
        // console.log("decrease btn clicked");
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(event.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(event.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        controlList();
    }

});


/**********
 * 
 * LIST CONTROLLER
 * 
 */

const controlList = () => {
    // Create a new list if there is none
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handling  update and delete list item events
elements.shopping.addEventListener('click', el => {
    const id = el.target.closest('.shopping__item').dataset.itemid;

    console.log(id);
    if(el.target.matches('.shopping__delete, .shopping__delete *')) {
        console.log('delete btn clicked');
        state.list.deleteItem(id);

        listView.deleteItem(id);
    } else if(el.target.matches('.shopping__count-value')) {
        
        const val = parseFloat(el.target.value, 10);
        console.log(val);
        state.list.updateCount(id, val);
    }
});



















