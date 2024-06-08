const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const resultsContainer = document.querySelector('#results');
const paginationContainer = document.querySelector('#pagination');
const pageSize = 4; // Number of items per page
let currentPage = 1;
let currentRecipes = [];
let totalResults = 0;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=${(currentPage - 1) * pageSize}&to=${currentPage * pageSize}`);
    const data = await response.json();
    currentRecipes = data.hits;
    totalResults = data.count;
    displayRecipes();
    displayPagination();
}

function displayRecipes() {
    let html = '';
    if (currentRecipes.length === 0) {
        html = '<p class="error-message">No recipes found. Please try a different search.</p>';
    } else {
        currentRecipes.forEach((recipe) => {
            html += `
            <div>
                <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
                <h3>${recipe.recipe.label}</h3>
                <ul>
                    ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
                <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
            </div> 
            `;
        });
    }
    resultsContainer.innerHTML = html;
}

// Pagination
function displayPagination() {
    const totalPages = Math.ceil(totalResults / pageSize);
    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml += `<button onclick="goToPage(${currentPage === 1 ? 1 : currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&#10094; Previous</button>`;

        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<button onclick="goToPage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
        }

        paginationHtml += `<button onclick="goToPage(${currentPage === totalPages ? totalPages : currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next &#10095;</button>`;
    }
    paginationContainer.innerHTML = paginationHtml;
}

function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(totalResults / pageSize)) {
        currentPage = page;
        searchRecipes();
    }
}
