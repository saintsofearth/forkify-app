import Search from './models/Search'
import {elements, renderLoader, clearLoader} from './views/base'
import * as searchView from './views/searchView'
import Recipe from './models/Recipe'
/*** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};


/***Search Controller
 * 
 */
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput() // TODO
    // console.log(query);

    if(query) {
        // 2. New search object and add it to state
        state.search = new Search(query);

        // 3. Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', el => {
    el.preventDefault();
    controlSearch();

})

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

const r = new Recipe(47746);
r.getRecipe();
console.log(r);
