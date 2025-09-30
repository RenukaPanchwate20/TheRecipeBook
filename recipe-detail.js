// Recipe Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRecipeDetail();
});

function initializeRecipeDetail() {
    loadRecipeData();
    setupServingAdjuster();
    setupIngredientCheckboxes();
    setupStepCheckboxes();
    setupFavoriteButton();
}

function loadRecipeData() {
    const recipeId = localStorage.getItem('currentRecipe');
    if (!recipeId) {
        // Redirect to home if no recipe ID
        window.location.href = 'index.html';
        return;
    }

    // First check user recipes, then fall back to sample recipes
    const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
    let recipe = userRecipes[recipeId] || (window.recipeDatabase && window.recipeDatabase[recipeId]);

    if (!recipe) {
        alert('Recipe not found');
        window.location.href = 'index.html';
        return;
    }

    populateRecipeData(recipe);
}

function populateRecipeData(recipe) {
    // Update page title
    document.title = `${recipe.title} - My Recipe Book`;

    // Update recipe header
    document.getElementById('recipeImage').src = recipe.image;
    document.getElementById('recipeImage').alt = recipe.title;
    document.getElementById('recipeCategory').textContent = formatCategory(recipe.category);
    document.getElementById('recipeTitle').textContent = recipe.title;
    document.getElementById('recipeDescription').textContent = recipe.description;

    // Update meta information
    document.getElementById('prepTime').textContent = recipe.prepTime || 0;
    document.getElementById('cookTime').textContent = recipe.cookTime || 0;
    document.getElementById('servings').textContent = recipe.servings || 1;
    document.getElementById('difficulty').textContent = recipe.difficulty || 'Medium';

    // Update servings adjuster
    const servingSize = document.getElementById('servingSize');
    servingSize.value = recipe.servings || 1;

    // Update ingredients list
    updateIngredientsList(recipe.ingredients, recipe.servings);

    // Update instructions list
    updateInstructionsList(recipe.instructions);

    // Update notes section
    updateNotesSection(recipe.notes);

    // Update nutrition information
    updateNutritionInfo(recipe.nutrition);

    // Update favorite button
    updateFavoriteButton(recipe.id);
}

function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function updateIngredientsList(ingredients, originalServings) {
    const ingredientsList = document.getElementById('ingredientsList');
    if (!ingredientsList || !ingredients) return;

    ingredientsList.innerHTML = ingredients.map((ingredient, index) => `
        <li>
            <input type="checkbox" id="ingredient${index + 1}">
            <label for="ingredient${index + 1}" data-original="${ingredient}">${ingredient}</label>
        </li>
    `).join('');
    
    // Store original servings and ingredients for scaling
    ingredientsList.dataset.originalServings = originalServings;
}

function updateInstructionsList(instructions) {
    const instructionsList = document.getElementById('instructionsList');
    if (!instructionsList || !instructions) return;

    instructionsList.innerHTML = instructions.map((instruction, index) => `
        <div class="instruction-step">
            <div class="step-number">${index + 1}</div>
            <div class="step-content">
                <p>${instruction}</p>
            </div>
            <div class="step-checkbox">
                <input type="checkbox" id="step${index + 1}">
            </div>
        </div>
    `).join('');
}

function updateNotesSection(notes) {
    const notesSection = document.getElementById('notesSection');
    if (!notesSection) return;

    if (notes && notes.trim()) {
        notesSection.style.display = 'block';
        const notesContent = notesSection.querySelector('.notes-content');
        if (notesContent) {
            notesContent.innerHTML = `<p>${notes}</p>`;
        }
    } else {
        notesSection.style.display = 'none';
    }
}

function updateNutritionInfo(nutrition) {
    if (!nutrition) return;

    const nutritionItems = document.querySelectorAll('.nutrition-item');
    const nutritionMap = {
        'Calories': nutrition.calories || 0,
        'Protein': nutrition.protein || '0g',
        'Carbs': nutrition.carbs || '0g',
        'Fat': nutrition.fat || '0g'
    };

    nutritionItems.forEach(item => {
        const label = item.querySelector('.nutrition-label').textContent.toUpperCase();
        const value = item.querySelector('.nutrition-value');
        if (nutritionMap[label] !== undefined) {
            value.textContent = nutritionMap[label];
        }
    });
}

// Serving Size Adjuster
function setupServingAdjuster() {
    const servingSize = document.getElementById('servingSize');
    const decreaseBtn = document.getElementById('decreaseServing');
    const increaseBtn = document.getElementById('increaseServing');

    decreaseBtn.addEventListener('click', () => {
        const current = parseInt(servingSize.value);
        if (current > 1) {
            servingSize.value = current - 1;
            updateIngredientAmounts();
        }
    });

    increaseBtn.addEventListener('click', () => {
        const current = parseInt(servingSize.value);
        if (current < 20) {
            servingSize.value = current + 1;
            updateIngredientAmounts();
        }
    });

    servingSize.addEventListener('change', updateIngredientAmounts);
}

function updateIngredientAmounts() {
    const servingSize = parseInt(document.getElementById('servingSize').value);
    const ingredientsList = document.getElementById('ingredientsList');
    const originalServings = parseInt(ingredientsList.dataset.originalServings) || 1;
    
    const multiplier = servingSize / originalServings;
    
    ingredientsList.querySelectorAll('label').forEach(label => {
        const originalText = label.dataset.original;
        const scaledText = scaleIngredientAmount(originalText, multiplier);
        label.textContent = scaledText;
    });
}

function scaleIngredientAmount(ingredient, multiplier) {
    // Simple scaling - look for numbers at the beginning of ingredients
    const numberPattern = /^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.*)$/;
    const match = ingredient.match(numberPattern);
    
    if (match) {
        const amount = parseFloat(match[1]);
        const rest = match[2];
        
        if (!isNaN(amount)) {
            let scaledAmount = amount * multiplier;
            
            // Round to reasonable precision
            if (scaledAmount < 1 && scaledAmount > 0) {
                scaledAmount = Math.round(scaledAmount * 100) / 100; // 2 decimal places
            } else if (scaledAmount < 10) {
                scaledAmount = Math.round(scaledAmount * 10) / 10; // 1 decimal place
            } else {
                scaledAmount = Math.round(scaledAmount);
            }
            
            return `${scaledAmount} ${rest}`;
        }
    }
    
    return ingredient; // Return original if no number found
}

// Checkbox Functionality
function setupIngredientCheckboxes() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.id.startsWith('ingredient')) {
            const label = e.target.nextElementSibling;
            if (e.target.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#999';
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '#555';
            }
        }
    });
}

function setupStepCheckboxes() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.id.startsWith('step')) {
            const step = e.target.closest('.instruction-step');
            if (e.target.checked) {
                step.style.opacity = '0.6';
                step.style.background = '#e8f5e8';
            } else {
                step.style.opacity = '1';
                step.style.background = '#f8f9fa';
            }
        }
    });
}

// Favorite Button
function setupFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        const recipeId = localStorage.getItem('currentRecipe');
        updateFavoriteButton(recipeId);
        
        favoriteBtn.addEventListener('click', function() {
            if (window.toggleFavorite) {
                window.toggleFavorite(recipeId);
            } else {
                // Fallback implementation
                toggleFavoriteLocal(recipeId);
            }
        });
    }
}

function updateFavoriteButton(recipeId) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (!favoriteBtn) return;

    const isFav = isFavoriteLocal(recipeId);
    favoriteBtn.innerHTML = isFav 
        ? '<i class="fas fa-heart"></i> Remove from Favorites'
        : '<i class="far fa-heart"></i> Add to Favorites';
    
    if (isFav) {
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.classList.remove('active');
    }
}

function toggleFavoriteLocal(recipeId) {
    const favorites = getFavoriteRecipesLocal();
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(recipeId);
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    updateFavoriteButton(recipeId);
}

function getFavoriteRecipesLocal() {
    const favorites = localStorage.getItem('favoriteRecipes');
    return favorites ? JSON.parse(favorites) : [];
}

function isFavoriteLocal(recipeId) {
    return getFavoriteRecipesLocal().includes(recipeId);
}

// Recipe Sharing
function shareRecipe() {
    const currentRecipe = getCurrentRecipeLocal();
    if (!currentRecipe) return;

    if (navigator.share) {
        navigator.share({
            title: currentRecipe.title,
            text: currentRecipe.description,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast('Recipe link copied to clipboard!');
            }).catch(() => {
                promptShareUrl(shareUrl);
            });
        } else {
            promptShareUrl(shareUrl);
        }
    }
}

function promptShareUrl(url) {
    const input = prompt('Copy this link to share the recipe:', url);
}

function showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

function getCurrentRecipeLocal() {
    const recipeId = localStorage.getItem('currentRecipe');
    if (!recipeId) return null;

    const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
    return userRecipes[recipeId] || (window.recipeDatabase && window.recipeDatabase[recipeId]);
}

// Timer functionality (bonus feature)
function startCookingTimer(minutes) {
    if ('Notification' in window) {
        Notification.requestPermission();
    }

    const timer = minutes * 60; // Convert to seconds
    let remaining = timer;

    const interval = setInterval(() => {
        remaining--;
        
        if (remaining <= 0) {
            clearInterval(interval);
            
            // Show notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification('Cooking Timer', {
                    body: 'Your cooking timer has finished!',
                    icon: '/favicon.ico'
                });
            }
            
            alert('Cooking timer finished!');
        }
    }, 1000);
    
    showToast(`Timer started for ${minutes} minutes`);
}

// Print functionality
function printRecipe() {
    window.print();
}

// Export recipe functionality
function exportRecipe() {
    const recipe = getCurrentRecipeLocal();
    if (!recipe) return;

    const recipeText = formatRecipeForExport(recipe);
    const blob = new Blob([recipeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}_recipe.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
}

function formatRecipeForExport(recipe) {
    let text = `${recipe.title}\n`;
    text += '='.repeat(recipe.title.length) + '\n\n';
    
    if (recipe.description) {
        text += `Description: ${recipe.description}\n\n`;
    }
    
    text += `Prep Time: ${recipe.prepTime} minutes\n`;
    text += `Cook Time: ${recipe.cookTime} minutes\n`;
    text += `Servings: ${recipe.servings}\n\n`;
    
    text += 'INGREDIENTS:\n';
    recipe.ingredients.forEach((ingredient, index) => {
        text += `${index + 1}. ${ingredient}\n`;
    });
    
    text += '\nINSTRUCTIONS:\n';
    recipe.instructions.forEach((instruction, index) => {
        text += `${index + 1}. ${instruction}\n`;
    });
    
    if (recipe.notes) {
        text += `\nNOTES:\n${recipe.notes}\n`;
    }
    
    text += '\n---\n';
    text += 'Recipe from My Recipe Book\n';
    
    return text;
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.shareRecipe = shareRecipe;
    window.printRecipe = printRecipe;
    window.exportRecipe = exportRecipe;
    window.startCookingTimer = startCookingTimer;
}