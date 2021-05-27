import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkupButton(type) {
    const currPage = this._data.page;

    const prevButton = `
    <button data-goto="${
      currPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
         <use href="${icons}#icon-arrow-left"></use>
        </svg>
          <span>Page ${currPage - 1}</span>
    </button>`;

    const nextButton = `
    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
         </svg>
    </button>
  `;
    if (type === 'next') {
      return nextButton;
    }
    if (type === 'prev') {
      return prevButton;
    }
    if (type === 'both') {
      return [prevButton, nextButton].join('');
    }
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // Page 1 without others
    if (currPage === 1 && numPages === 1) return ``;

    // Page 1 with others
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next');
    }

    // last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev');
    }

    // any other page
    if (currPage < numPages && currPage !== 1) {
      return this._generateMarkupButton('both');
    }
  }
}

export default new PaginationView();
