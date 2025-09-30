// Add Recipe Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAddRecipeForm();
});

function initializeAddRecipeForm() {
    setupIngredientManagement();
    setupStepManagement();
    setupImageUpload();
    setupFormValidation();
    setupFormSubmission();
}

// Ingredient Management
function setupIngredientManagement() {
    const addIngredientBtn = document.getElementById('addIngredient');
    const ingredientsContainer = document.querySelector('.ingredients-container');

    addIngredientBtn.addEventListener('click', function() {
        addIngredientField();
    });

    // Setup remove functionality for existing ingredient
    setupIngredientRemove();
}

function addIngredientField() {
    const ingredientsContainer = document.querySelector('.ingredients-container');
    const ingredientItem = document.createElement('div');
    ingredientItem.className = 'ingredient-item';
    
    ingredientItem.innerHTML = `
        <input type="text" name="ingredients" placeholder="e.g., 2 cups flour" required>
        <button type="button" class="remove-ingredient">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    ingredientsContainer.appendChild(ingredientItem);
    setupIngredientRemove();
}

function setupIngredientRemove() {
    const removeButtons = document.querySelectorAll('.remove-ingredient');
    removeButtons.forEach((button, index) => {
        button.disabled = removeButtons.length <= 1;
        
        button.onclick = function() {
            if (removeButtons.length > 1) {
                this.closest('.ingredient-item').remove();
                setupIngredientRemove(); // Re-setup after removal
            }
        };
    });
}

// Step Management
function setupStepManagement() {
    const addStepBtn = document.getElementById('addStep');
    const stepsContainer = document.querySelector('.steps-container');

    addStepBtn.addEventListener('click', function() {
        addStepField();
    });

    // Setup remove functionality for existing step
    setupStepRemove();
}

function addStepField() {
    const stepsContainer = document.querySelector('.steps-container');
    const stepItems = stepsContainer.querySelectorAll('.step-item');
    const stepNumber = stepItems.length + 1;
    
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    
    stepItem.innerHTML = `
        <div class="step-number">${stepNumber}</div>
        <textarea name="steps" placeholder="Describe step ${stepNumber}..." required></textarea>
        <button type="button" class="remove-step">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    stepsContainer.appendChild(stepItem);
    setupStepRemove();
}

function setupStepRemove() {
    const removeButtons = document.querySelectorAll('.remove-step');
    const stepItems = document.querySelectorAll('.step-item');
    
    removeButtons.forEach((button, index) => {
        button.disabled = removeButtons.length <= 1;
        
        button.onclick = function() {
            if (removeButtons.length > 1) {
                this.closest('.step-item').remove();
                updateStepNumbers();
                setupStepRemove(); // Re-setup after removal
            }
        };
    });
}

function updateStepNumbers() {
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        const stepNumber = item.querySelector('.step-number');
        const textarea = item.querySelector('textarea');
        
        stepNumber.textContent = index + 1;
        textarea.placeholder = `Describe step ${index + 1}...`;
    });
}

// Image Upload Management
function setupImageUpload() {
    const imageInput = document.getElementById('recipeImage');
    const uploadArea = document.getElementById('imageUploadArea');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImage');

    // Click to upload
    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e74c3c';
        uploadArea.style.backgroundColor = '#fff';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = '#fafafa';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.backgroundColor = '#fafafa';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleImageFile(file);
            }
        }
    });

    // File input change
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    });

    // Remove image
    removeImageBtn.addEventListener('click', function() {
        imageInput.value = '';
        uploadArea.style.display = 'block';
        imagePreview.style.display = 'none';
    });
}

function handleImageFile(file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadArea = document.getElementById('imageUploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');

        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('recipeForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (numValue <= 0) {
            isValid = false;
            errorMessage = 'Please enter a positive number';
        }
    }

    showFieldError(field, isValid, errorMessage);
    return isValid;
}

function showFieldError(field, isValid, message) {
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (isValid) {
        field.style.borderColor = '#ddd';
        if (errorElement) errorElement.textContent = '';
    } else {
        field.style.borderColor = '#dc3545';
        if (errorElement) errorElement.textContent = message;
    }
}

function clearFieldError(field) {
    field.style.borderColor = '#ddd';
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) errorElement.textContent = '';
}

function validateForm() {
    const form = document.getElementById('recipeForm');
    let isValid = true;

    // Validate required fields
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate ingredients
    const ingredients = form.querySelectorAll('input[name="ingredients"]');
    const hasIngredients = Array.from(ingredients).some(input => input.value.trim());
    if (!hasIngredients) {
        const errorElement = document.getElementById('ingredientsError');
        if (errorElement) errorElement.textContent = 'At least one ingredient is required';
        isValid = false;
    }

    // Validate steps
    const steps = form.querySelectorAll('textarea[name="steps"]');
    const hasSteps = Array.from(steps).some(textarea => textarea.value.trim());
    if (!hasSteps) {
        const errorElement = document.getElementById('stepsError');
        if (errorElement) errorElement.textContent = 'At least one step is required';
        isValid = false;
    }

    return isValid;
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('recipeForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitRecipe();
        }
    });
}

function submitRecipe() {
    const formData = collectFormData();
    
    // Save to localStorage (in a real app, this would go to a server)
    saveRecipe(formData);
    
    // Show success modal
    showSuccessModal();
}

function collectFormData() {
    const form = document.getElementById('recipeForm');
    const formData = new FormData(form);
    
    // Collect ingredients
    const ingredients = [];
    form.querySelectorAll('input[name="ingredients"]').forEach(input => {
        if (input.value.trim()) {
            ingredients.push(input.value.trim());
        }
    });
    
    // Collect steps
    const steps = [];
    form.querySelectorAll('textarea[name="steps"]').forEach(textarea => {
        if (textarea.value.trim()) {
            steps.push(textarea.value.trim());
        }
    });
    
    // Create recipe object
    const recipe = {
        id: generateRecipeId(),
        title: formData.get('recipeName').trim(),
        description: formData.get('recipeDescription').trim() || '',
        category: formData.get('recipeCategory') || 'other',
        prepTime: parseInt(formData.get('prepTime')) || 0,
        cookTime: parseInt(formData.get('cookTime')) || 0,
        servings: parseInt(formData.get('servings')) || 1,
        ingredients: ingredients,
        instructions: steps,
        notes: formData.get('recipeNotes').trim() || '',
        image: getImageDataUrl(),
        difficulty: 'Medium', // Default difficulty
        nutrition: {
            calories: 0,
            protein: '0g',
            carbs: '0g',
            fat: '0g'
        },
        dateAdded: new Date().toISOString()
    };
    
    return recipe;
}

function generateRecipeId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `recipe-${timestamp}-${random}`;
}

function getImageDataUrl() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage && previewImage.src && previewImage.src.startsWith('data:')) {
        return previewImage.src;
    }
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Default image
}

function saveRecipe(recipe) {
    try {
        // Get existing recipes from localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
        
        // Add new recipe
        existingRecipes[recipe.id] = recipe;
        
        // Save back to localStorage
        localStorage.setItem('userRecipes', JSON.stringify(existingRecipes));
        
        // Also add to the main recipe database for immediate use
        if (window.recipeDatabase) {
            window.recipeDatabase[recipe.id] = recipe;
        }
        
        return true;
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('There was an error saving your recipe. Please try again.');
        return false;
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Auto-hide modal after 5 seconds
        setTimeout(() => {
            modal.style.display = 'none';
        }, 5000);
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('recipeForm');
    form.reset();
    
    // Reset ingredients to one field
    const ingredientsContainer = document.querySelector('.ingredients-container');
    ingredientsContainer.innerHTML = `
        <div class="ingredient-item">
            <input type="text" name="ingredients" placeholder="e.g., 2 cups flour" required>
            <button type="button" class="remove-ingredient" disabled>
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Reset steps to one field
    const stepsContainer = document.querySelector('.steps-container');
    stepsContainer.innerHTML = `
        <div class="step-item">
            <div class="step-number">1</div>
            <textarea name="steps" placeholder="Describe the first step..." required></textarea>
            <button type="button" class="remove-step" disabled>
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Reset image upload
    const uploadArea = document.getElementById('imageUploadArea');
    const imagePreview = document.getElementById('imagePreview');
    uploadArea.style.display = 'block';
    imagePreview.style.display = 'none';
    
    // Clear error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // Reset field borders
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.style.borderColor = '#ddd';
    });
    
    // Re-initialize form
    initializeAddRecipeForm();
}