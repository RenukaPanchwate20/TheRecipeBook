// Main JavaScript functionality for Recipe Book

// Sample Recipe Database
const recipeDatabase = {
    'spaghetti-carbonara': {
        id: 'spaghetti-carbonara',
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        difficulty: 'Medium',
        ingredients: [
            '400g spaghetti pasta',
            '200g pancetta or guanciale, diced',
            '4 large egg yolks',
            '100g Pecorino Romano cheese, grated',
            '2 cloves garlic, minced',
            'Salt and black pepper to taste',
            '2 tablespoons olive oil'
        ],
        instructions: [
            'Bring a large pot of salted water to boil. Add spaghetti and cook according to package directions until al dente.',
            'While pasta cooks, heat olive oil in a large skillet over medium heat. Add pancetta and cook until crispy, about 5-7 minutes.',
            'Add minced garlic to the pancetta and cook for another minute until fragrant.',
            'In a bowl, whisk together egg yolks and grated Pecorino Romano cheese until well combined.',
            'Reserve 1 cup of pasta cooking water, then drain the spaghetti.',
            'Add the hot pasta to the skillet with pancetta. Remove from heat immediately.',
            'Quickly add the egg and cheese mixture, tossing rapidly to coat the pasta. Add pasta water gradually until you achieve a creamy consistency.',
            'Season with black pepper and serve immediately while hot. Garnish with extra cheese if desired.'
        ],
        notes: 'The key to perfect carbonara is timing and temperature. Make sure to remove the pan from heat before adding the egg mixture to prevent scrambling. The residual heat from the pasta and pan will cook the eggs gently. Traditional carbonara doesn\'t include cream - the creaminess comes from the eggs and cheese combined with the starchy pasta water.',
        nutrition: {
            calories: 520,
            protein: '22g',
            carbs: '68g',
            fat: '18g'
        }
    },
    'chicken-tikka': {
        id: 'chicken-tikka',
        title: 'Chicken Tikka Masala',
        description: 'Creamy and flavorful Indian curry with tender chicken',
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        prepTime: 30,
        cookTime: 45,
        servings: 6,
        difficulty: 'Medium',
        ingredients: [
            '2 lbs chicken breast, cut into chunks',
            '1 cup plain yogurt',
            '2 tbsp lemon juice',
            '2 tsp garam masala',
            '1 tsp cumin powder',
            '1 tsp coriander powder',
            '1 onion, diced',
            '3 cloves garlic, minced',
            '1 inch ginger, grated',
            '1 can crushed tomatoes',
            '1 cup heavy cream',
            'Fresh cilantro for garnish'
        ],
        instructions: [
            'Marinate chicken chunks in yogurt, lemon juice, and half the spices for at least 30 minutes.',
            'Heat oil in a large pan and cook marinated chicken until golden. Set aside.',
            'In the same pan, sauté onions until translucent, add garlic and ginger.',
            'Add remaining spices and cook for 1 minute until fragrant.',
            'Add crushed tomatoes and simmer for 10 minutes.',
            'Stir in heavy cream and return chicken to the pan.',
            'Simmer for 15-20 minutes until sauce thickens.',
            'Garnish with fresh cilantro and serve with rice or naan.'
        ],
        notes: 'For extra flavor, you can grill the marinated chicken instead of pan-frying. Adjust the amount of cream based on your preferred consistency.',
        nutrition: {
            calories: 380,
            protein: '32g',
            carbs: '12g',
            fat: '24g'
        }
    },
    'chocolate-cake': {
        id: 'chocolate-cake',
        title: 'Decadent Chocolate Cake',
        description: 'Rich, moist chocolate cake perfect for special occasions',
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        prepTime: 20,
        cookTime: 60,
        servings: 8,
        difficulty: 'Easy',
        ingredients: [
            '2 cups all-purpose flour',
            '2 cups sugar',
            '3/4 cup cocoa powder',
            '2 tsp baking soda',
            '1 tsp baking powder',
            '1 tsp salt',
            '2 eggs',
            '1 cup buttermilk',
            '1 cup strong black coffee, cooled',
            '1/2 cup vegetable oil',
            '1 tsp vanilla extract'
        ],
        instructions: [
            'Preheat oven to 350°F. Grease and flour two 9-inch round cake pans.',
            'In a large bowl, whisk together flour, sugar, cocoa, baking soda, baking powder, and salt.',
            'In another bowl, beat eggs, then add buttermilk, coffee, oil, and vanilla.',
            'Pour wet ingredients into dry ingredients and mix until just combined.',
            'Divide batter between prepared pans.',
            'Bake for 30-35 minutes until a toothpick comes out clean.',
            'Cool in pans for 10 minutes, then turn out onto wire racks.',
            'Cool completely before frosting.'
        ],
        notes: 'The coffee enhances the chocolate flavor without making the cake taste like coffee. You can substitute with hot water if preferred.',
        nutrition: {
            calories: 420,
            protein: '6g',
            carbs: '78g',
            fat: '12g'
        }
    },
    'caesar-salad': {
        id: 'caesar-salad',
        title: 'Classic Caesar Salad',
        description: 'Fresh romaine lettuce with homemade Caesar dressing',
        category: 'salad',
        image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
            '2 large romaine lettuce heads',
            '1/2 cup grated Parmesan cheese',
            '1 cup croutons',
            '2 cloves garlic, minced',
            '2 anchovy fillets (optional)',
            '1 egg yolk',
            '1 tbsp lemon juice',
            '1 tsp Worcestershire sauce',
            '1/2 cup olive oil',
            'Salt and pepper to taste'
        ],
        instructions: [
            'Wash and dry romaine lettuce thoroughly. Chop into bite-sized pieces.',
            'In a small bowl, mash garlic and anchovies into a paste.',
            'Whisk in egg yolk, lemon juice, and Worcestershire sauce.',
            'Slowly drizzle in olive oil while whisking to create an emulsion.',
            'Season dressing with salt and pepper.',
            'Toss lettuce with dressing in a large bowl.',
            'Add Parmesan cheese and croutons.',
            'Serve immediately.'
        ],
        notes: 'For food safety, you can use pasteurized eggs or substitute with mayonnaise. The anchovy paste adds authentic umami flavor but can be omitted for vegetarians.',
        nutrition: {
            calories: 280,
            protein: '8g',
            carbs: '12g',
            fat: '24g'
        }
    }
};

// Navigation Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
});

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 0) {
                searchRecipes(query);
            } else {
                displayAllRecipes();
            }
        });
    }
}

function searchRecipes(query) {
    const recipeGrid = document.getElementById('recipeGrid');
    if (!recipeGrid) return;

    const filteredRecipes = Object.values(recipeDatabase).filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.category.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
    );

    renderRecipes(filteredRecipes);
}

function displayAllRecipes() {
    renderRecipes(Object.values(recipeDatabase));
}

function renderRecipes(recipes) {
    const recipeGrid = document.getElementById('recipeGrid');
    if (!recipeGrid) return;

    if (recipes.length === 0) {
        recipeGrid.innerHTML = '<div class="no-results">No recipes found. Try a different search term.</div>';
        return;
    }

    recipeGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="viewRecipe('${recipe.id}')">
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.prepTime + recipe.cookTime} mins</span>
                    <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Recipe Navigation
function viewRecipe(recipeId) {
    // Store the recipe ID for the detail page
    localStorage.setItem('currentRecipe', recipeId);
    window.location.href = 'recipe-detail.html';
}

// Smooth Scrolling for Anchor Links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Favorite Recipes Management
function toggleFavorite(recipeId) {
    const favorites = getFavoriteRecipes();
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeId);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    updateFavoriteButton(recipeId);
}

function getFavoriteRecipes() {
    const favorites = localStorage.getItem('favoriteRecipes');
    return favorites ? JSON.parse(favorites) : [];
}

function isFavorite(recipeId) {
    return getFavoriteRecipes().includes(recipeId);
}

function updateFavoriteButton(recipeId) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        const isFav = isFavorite(recipeId);
        favoriteBtn.innerHTML = isFav 
            ? '<i class="fas fa-heart"></i> Remove from Favorites'
            : '<i class="far fa-heart"></i> Add to Favorites';
        
        if (isFav) {
            favoriteBtn.classList.add('active');
        } else {
            favoriteBtn.classList.remove('active');
        }
    }
}

// Recipe Sharing
function shareRecipe() {
    const currentRecipe = getCurrentRecipe();
    if (!currentRecipe) return;

    if (navigator.share) {
        navigator.share({
            title: currentRecipe.title,
            text: currentRecipe.description,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Recipe link copied to clipboard!');
        }).catch(() => {
            // Fallback if clipboard API is not available
            prompt('Copy this link to share the recipe:', shareUrl);
        });
    }
}

// Get Current Recipe
function getCurrentRecipe() {
    const recipeId = localStorage.getItem('currentRecipe');
    return recipeId ? recipeDatabase[recipeId] : null;
}

// Utility Functions
function formatCookingTime(prepTime, cookTime) {
    const total = prepTime + cookTime;
    if (total < 60) {
        return `${total} mins`;
    } else {
        const hours = Math.floor(total / 60);
        const minutes = total % 60;
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeSmoothScrolling();
    
    // Load recipes on homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        displayAllRecipes();
    }
});

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.recipeDatabase = recipeDatabase;
    window.viewRecipe = viewRecipe;
    window.shareRecipe = shareRecipe;
    window.toggleFavorite = toggleFavorite;
    window.getCurrentRecipe = getCurrentRecipe;
}