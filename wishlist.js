// --- 1. CONFIGURATION & DOM SELECTORS ---
const wishlistGrid = document.getElementById('wishlist-grid');
const placeholderText = document.querySelector('.placeholder-text');
const WISHLIST_KEY = 'movieWishlist'; // Must be the same key as in script.js

// --- 2. LOCALSTORAGE FUNCTIONS ---

/**
 * Gets the wishlist array from localStorage.
 */
function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

/**
 * Saves the wishlist array to localStorage.
 */
function saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

// --- 3. WISHLIST DISPLAY & REMOVE LOGIC ---

/**
 * Removes a movie from the wishlist by its ID.
 */
function removeFromWishlist(imdbID) {
    let wishlist = getWishlist();
    // Create a new array *without* the movie we want to remove
    const newWishlist = wishlist.filter(movie => movie.imdbID !== imdbID);
    saveWishlist(newWishlist);
    
    // Refresh the UI
    loadWishlistMovies();
}

/**
 * Loads and displays all movies from the wishlist.
 */
function loadWishlistMovies() {
    const wishlist = getWishlist();

    if (wishlist.length === 0) {
        // Show the placeholder text if the list is empty
        wishlistGrid.innerHTML = ''; // Clear any old movies
        placeholderText.style.display = 'block';
    } else {
        // Hide the placeholder text and display movies
        placeholderText.style.display = 'none';
        wishlistGrid.innerHTML = ''; // Clear grid before adding new
        
        wishlist.forEach(movie => {
            const movieCard = document.createElement('div'); // Use <div>, not <a>
            movieCard.className = 'movie-card';

            const posterUrl = (movie.Poster === 'N/A') 
                ? 'https://via.placeholder.com/300x450.png?text=No+Poster' 
                : movie.Poster;

            // Notice the new "Remove" button
            movieCard.innerHTML = `
                <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">
                    <img src="${posterUrl}" alt="${movie.Title} Poster">
                </a>
                
                <button class="btn-wishlist-remove" title="Remove from wishlist">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="movie-card-info">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
            `;

            // Add event listener for the new "Remove" button
            const removeBtn = movieCard.querySelector('.btn-wishlist-remove');
            removeBtn.addEventListener('click', () => {
                removeFromWishlist(movie.imdbID);
            });

            wishlistGrid.appendChild(movieCard);
        });
    }
}

// --- 4. INITIALIZATION ---
// Run on page load
document.addEventListener('DOMContentLoaded', loadWishlistMovies);