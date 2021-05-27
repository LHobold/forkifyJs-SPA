import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class renderView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found!`;
  _message = '';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new renderView();
