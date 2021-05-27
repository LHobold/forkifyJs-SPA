import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC, RESET_FORM_SEC } from './config.js';
import { resetForm } from './helpers.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import addrecipeView from './views/addrecipeView.js';

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(
      `We could not find that recipe, please try another one!`
    );
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addrecipeView.addHanlerUploadRecipe(controlAddRecipe);
  showKct();
}
init();

async function controlSearchResults() {
  try {
    // Get query

    const query = searchView.getQuery();
    if (!query) return;
    //Get results from API
    await model.loadSearchResults(query);
    // Render spinner
    resultsView.renderSpinner();
    // Render result on screen
    resultsView.render(model.getSearchResultsPage());
    // Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

function controlPagination(goToPage) {
  // Render NEW results on screen
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render NEW pagination
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe servings
  model.updateServings(newServings);
  // Update view
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // Add or remove bookmark
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Render spinner
    addrecipeView.renderSpinner();

    // Send data to API
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render sucess message on UI
    addrecipeView.renderMessage();

    // Reset form
    resetForm();

    // // Close form window
    // setTimeout(function () {
    //   addrecipeView.toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000);

    // // Reset form
    // setTimeout(function () {
    //   addrecipeView.resetForm();
    // }, RESET_FORM_SEC * 1000);

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Update ID URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.log(err);
    addrecipeView.renderError(err);
    resetForm();
  }
}

function showKct() {
  console.log('Caceta');
}
