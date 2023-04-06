import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchForm = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchForm.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  const inputValue = searchForm.value.toLowerCase().trim();
  if (inputValue === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length > 1 && countries.length <= 10) {
        countryList.innerHTML = renderCountryList(countries);
        countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        countryInfo.innerHTML = renderCountryInfo(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      return error;
    });
}

function renderCountryInfo(countries) {
  const countryMarkup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `
      <img src="${flags.svg}" alt="flag" width="40px">
      <h1 class="country-name">${name.official}</h1>
      <p class="country-text"><b>Capital:</b> ${capital}</p>
      <p class="country-text"><b>Population:</b> ${population}</p>
      <p class="country-text"><b>Languages:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  return countryMarkup;
}

function renderCountryList(countries) {
  const countryMarkup = countries
    .map(({ flags, name }) => {
      return `
      <li>
          <img src="${flags.svg}" alt="flag" width="30px">
          <h2 class="country-name">${name.official}</h2>
        </li>`;
    })
    .join('');
  return countryMarkup;
}