import Search from './models/Search'

/*** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const controlSearch = async () => {
    // 1. Get query from view
    const query = 'pizza' // TODO

    if(query) {
        // 2. New search object and add it to state
        state.search = new Search(query);

        // 3. Prepare UI for result

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit', el => {
    el.preventDefault();
    controlSearch();

})
