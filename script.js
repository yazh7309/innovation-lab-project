// --- 1. CONFIGURATION & DOM SELECTORS ---

// !! PASTE YOUR OMDb API KEY HERE !!
const API_KEY = 'fbf6fbed'; // e.g., 'ab12345c'
const API_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=fbf6fbed`;

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const topMoviesContainer = document.getElementById('top-movies-container');

// --- WISHLIST KEY ---
const WISHLIST_KEY = 'movieWishlist';

// --- 2. CORE LOGIC (FETCHING & DISPLAYING) ---

async function searchMovies(searchTerm) {
    resultsContainer.innerHTML = '<p class="placeholder-text">Searching...</p>';
    try {
        const response = await fetch(`${API_URL}&s=${searchTerm}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.Response === 'True') {
            displayMovies(data.Search, resultsContainer, 'grid');
        } else {
            displayError(data.Error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        displayError('Something went wrong. Please try again.');
    }
}

async function fetchSingleMovie(title, container) {
    try {
        const response = await fetch(`${API_URL}&t=${title}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.Response === 'True') {
            displayMovies([data], container, 'row');
        } else {
            console.warn(`Could not find top pick: ${title}`);
        }
    } catch (error) {
        console.error(`Fetch error for ${title}:`, error);
    }
}

function displayMovies(movies, container, layout) {
    if (layout === 'grid') {
        container.innerHTML = '';
    }
    const currentWishlist = getWishlist();

    movies.forEach(movie => {
        const isInWishlist = currentWishlist.some(m => m.imdbID === movie.imdbID);
        const movieCard = document.createElement('a');
        movieCard.className = 'movie-card';
        movieCard.href = `https://www.imdb.com/title/${movie.imdbID}`;
        movieCard.target = '_blank';

        const posterUrl = (movie.Poster === 'N/A') 
            ? 'https://via.placeholder.com/300x450.png?text=No+Poster' 
            : movie.Poster;

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title} Poster">
            <button class="btn-wishlist ${isInWishlist ? 'active' : ''}" 
                    title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                <i class="${isInWishlist ? 'fas fa-heart' : 'far fa-heart'}"></i>
            </button>
            <div class="movie-card-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        const wishlistBtn = movieCard.querySelector('.btn-wishlist');
        wishlistBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlist(movie, wishlistBtn);
        });
        container.appendChild(movieCard);
    });
}

function displayError(message) {
    resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// --- 3. WISHLIST LOGIC (SIMPLIFIED) ---

function toggleWishlist(movie, btnElement) {
    let wishlist = getWishlist();
    const movieIndex = wishlist.findIndex(m => m.imdbID === movie.imdbID);
    const heartIcon = btnElement.querySelector('i'); // Get the icon element

    if (movieIndex === -1) {
        // Add to wishlist
        wishlist.push(movie);
        btnElement.classList.add('active');
        heartIcon.classList.remove('far'); // Change to solid heart
        heartIcon.classList.add('fas');
        btnElement.title = 'Remove from wishlist';
    } else {
        // Remove from wishlist
        wishlist.splice(movieIndex, 1);
        btnElement.classList.remove('active');
        heartIcon.classList.remove('fas'); // Change to outline heart
        heartIcon.classList.add('far');
        btnElement.title = 'Add to wishlist';
    }
    saveWishlist(wishlist);
}
    // ---REMOVED--- No longer need to call loadWishlistUI() here.

function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

// --- 4. EVENT LISTENERS & INITIALIZATION ---

function handleSearch(event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        searchMovies(searchTerm);
    }
}

async function loadTopPicks() {
    const topPicks = [
        "Inception", "The Dark Knight", "Interstellar",
        "Parasite", "The Matrix", "Dune"
    ];
    topMoviesContainer.innerHTML = '';
    for (const title of topPicks) {
        await fetchSingleMovie(title, topMoviesContainer);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    searchForm.addEventListener('submit', handleSearch);
    loadTopPicks();
    // ---REMOVED--- No longer need to call loadWishlistUI() here.
});