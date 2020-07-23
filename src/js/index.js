import axios from 'axios'
async function getRecipes(query) {
    const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
    const recipes = res.data;
    console.log(recipes);
}

getRecipes('pizza');