'use strict';

(function () {
  const PAGE_SIZE = 9;

  const state = {
    category: 'All',
    query: '',
    visible: PAGE_SIZE,
  };

  const filtersEl = document.querySelector('[data-filters]');
  const gridEl = document.querySelector('[data-grid]');
  const emptyEl = document.querySelector('[data-empty]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchForm = document.querySelector('[data-search]');
  const loadMoreWrap = document.querySelector('[data-load-more-wrap]');
  const loadMoreBtn = document.querySelector('[data-load-more]');

  function slugify(value) {
    return value
      .toLowerCase()
      .replace(/&/g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function countFor(category) {
    if (category === 'All') return COURSES.length;
    return COURSES.filter((course) => course.category === category).length;
  }

  function getFiltered() {
    const query = state.query.trim().toLowerCase();
    return COURSES.filter((course) => {
      const byCategory =
        state.category === 'All' || course.category === state.category;
      const byQuery = course.title.toLowerCase().includes(query);
      return byCategory && byQuery;
    });
  }

  function cardMarkup(course) {
    const tagClass = `card__tag card__tag--${slugify(course.category)}`;
    return `
      <li class="card">
        <div class="card__media">
          <img class="card__img" src="${course.img}" alt="${course.title}" loading="lazy">
        </div>
        <div class="card__body">
          <span class="${tagClass}">${course.category}</span>
          <h3 class="card__title">${course.title}</h3>
          <p class="card__footer">
            <span class="card__price">$${course.price}</span>
            <span class="card__author">by ${course.author}</span>
          </p>
        </div>
      </li>`;
  }

  function renderFilters() {
    filtersEl.innerHTML = CATEGORIES.map((category) => {
      const isActive = category === state.category;
      const modifier = isActive ? ' filters__item--active' : '';
      return `
        <li class="filters__item${modifier}">
          <button class="filters__button" type="button" data-category="${category}">
            ${category}<sup class="filters__count">${countFor(category)}</sup>
          </button>
        </li>`;
    }).join('');
  }

  function renderGrid() {
    const filtered = getFiltered();
    const shown = filtered.slice(0, state.visible);

    gridEl.innerHTML = shown.map(cardMarkup).join('');

    const isEmpty = filtered.length === 0;
    emptyEl.hidden = !isEmpty;
    gridEl.hidden = isEmpty;
    loadMoreWrap.hidden = isEmpty;
  }

  filtersEl.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;

    state.category = button.dataset.category;
    state.visible = PAGE_SIZE;
    renderFilters();
    renderGrid();
  });

  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    state.visible = PAGE_SIZE;
    renderGrid();
  });

  searchForm.addEventListener('submit', (event) => event.preventDefault());

  loadMoreBtn.addEventListener('click', () => {
    state.visible += PAGE_SIZE;
    renderGrid();
  });

  renderFilters();
  renderGrid();
})();
