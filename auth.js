// Authentication System for Recipe Book

// User Database Management
class UserDatabase {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.initializeDefaultAdmin();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('recipeBookUsers');
        return users ? JSON.parse(users) : {};
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('recipeBookUsers', JSON.stringify(this.users));
    }

    // Load current user session
    loadCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    // Save current user session
    saveCurrentUser(user) {
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
        this.currentUser = user;
    }

    // Initialize default admin account
    initializeDefaultAdmin() {
        if (!this.users['admin']) {
            this.users['admin'] = {
                id: 'admin',
                name: 'Administrator',
                email: 'admin@recipebook.com',
                username: 'admin',
                password: 'admin123', // In real app, this would be hashed
                role: 'admin',
                dateCreated: new Date().toISOString(),
                isActive: true
            };
            this.saveUsers();
        }
    }

    // Create new user account
    createUser(userData) {
        const userId = this.generateUserId();
        const user = {
            id: userId,
            name: userData.name,
            email: userData.email.toLowerCase(),
            username: userData.username.toLowerCase(),
            password: userData.password, // In real app, this would be hashed
            role: 'user',
            dateCreated: new Date().toISOString(),
            isActive: true,
            recipes: [],
            favorites: []
        };

        this.users[userId] = user;
        this.saveUsers();
        return user;
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Authenticate user login
    authenticateUser(emailOrUsername, password) {
        const identifier = emailOrUsername.toLowerCase();
        
        for (let userId in this.users) {
            const user = this.users[userId];
            if ((user.email === identifier || user.username === identifier) && 
                user.password === password && user.isActive) {
                return user;
            }
        }
        return null;
    }

    // Check if email exists
    emailExists(email) {
        email = email.toLowerCase();
        for (let userId in this.users) {
            if (this.users[userId].email === email) {
                return true;
            }
        }
        return false;
    }

    // Check if username exists
    usernameExists(username) {
        username = username.toLowerCase();
        for (let userId in this.users) {
            if (this.users[userId].username === username) {
                return true;
            }
        }
        return false;
    }

    // Get all users (admin only)
    getAllUsers() {
        return Object.values(this.users);
    }

    // Deactivate user account
    deactivateUser(userId) {
        if (this.users[userId]) {
            this.users[userId].isActive = false;
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Activate user account
    activateUser(userId) {
        if (this.users[userId]) {
            this.users[userId].isActive = true;
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Delete user account
    deleteUser(userId) {
        if (this.users[userId] && userId !== 'admin') {
            delete this.users[userId];
            this.saveUsers();
            return true;
        }
        return false;
    }
}

// Initialize user database
const userDB = new UserDatabase();

// Authentication Functions
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupAuthEventListeners();
});

function initializeAuth() {
    updateUserInterface();
    setupUserDropdown();
}

function setupAuthEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('auth-modal')) {
            closeAuthModals();
        }
    });
}

function setupUserDropdown() {
    const userBtn = document.getElementById('userBtn');
    const dropdown = document.getElementById('userDropdown');

    userBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        dropdown.classList.remove('show');
    });
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('signupModal').style.display = 'none';
    clearAuthErrors();
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
    document.getElementById('loginModal').style.display = 'none';
    clearAuthErrors();
}

function closeAuthModals() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('signupModal').style.display = 'none';
    clearAuthErrors();
    clearAuthForms();
}

function switchToSignup() {
    openSignupModal();
}

function switchToLogin() {
    openLoginModal();
}

// Form Handlers
function handleLogin(e) {
    e.preventDefault();
    clearAuthErrors();

    const emailOrUsername = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!emailOrUsername) {
        showError('loginEmailError', 'Email or username is required');
        return;
    }

    if (!password) {
        showError('loginPasswordError', 'Password is required');
        return;
    }

    // Authenticate user
    const user = userDB.authenticateUser(emailOrUsername, password);
    
    if (user) {
        userDB.saveCurrentUser(user);
        updateUserInterface();
        closeAuthModals();
        showSuccessMessage('Login successful! Welcome back, ' + user.name);
    } else {
        showError('loginPasswordError', 'Invalid email/username or password');
    }
}

function handleSignup(e) {
    e.preventDefault();
    clearAuthErrors();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    let isValid = true;

    if (!name || name.length < 2) {
        showError('signupNameError', 'Name must be at least 2 characters long');
        isValid = false;
    }

    if (!email || !isValidEmail(email)) {
        showError('signupEmailError', 'Please enter a valid email address');
        isValid = false;
    }

    if (!username || username.length < 3) {
        showError('signupUsernameError', 'Username must be at least 3 characters long');
        isValid = false;
    }

    if (!password || password.length < 6) {
        showError('signupPasswordError', 'Password must be at least 6 characters long');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }

    // Check for existing email/username
    if (userDB.emailExists(email)) {
        showError('signupEmailError', 'Email already exists');
        isValid = false;
    }

    if (userDB.usernameExists(username)) {
        showError('signupUsernameError', 'Username already exists');
        isValid = false;
    }

    if (!isValid) return;

    // Create user
    try {
        const user = userDB.createUser({ name, email, username, password });
        userDB.saveCurrentUser(user);
        updateUserInterface();
        closeAuthModals();
        showSuccessMessage('Account created successfully! Welcome, ' + user.name);
    } catch (error) {
        showError('signupEmailError', 'Error creating account. Please try again.');
    }
}

// User Interface Updates
function updateUserInterface() {
    const currentUser = userDB.currentUser;
    const guestMenu = document.getElementById('guestMenu');
    const loggedMenu = document.getElementById('loggedMenu');
    const userBtnText = document.getElementById('userBtnText');
    const welcomeUser = document.getElementById('welcomeUser');
    const adminPanel = document.getElementById('adminPanel');

    if (currentUser) {
        // User is logged in
        guestMenu.style.display = 'none';
        loggedMenu.style.display = 'block';
        userBtnText.textContent = currentUser.name;
        welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
        
        // Show admin panel if user is admin
        if (currentUser.role === 'admin') {
            adminPanel.style.display = 'block';
        } else {
            adminPanel.style.display = 'none';
        }
    } else {
        // User is not logged in
        guestMenu.style.display = 'block';
        loggedMenu.style.display = 'none';
        userBtnText.textContent = 'Account';
        adminPanel.style.display = 'none';
    }
}

// Logout Function
function logout() {
    userDB.saveCurrentUser(null);
    updateUserInterface();
    showSuccessMessage('Logged out successfully');
}

// Admin Functions
function showAdminPanel() {
    if (!userDB.currentUser || userDB.currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        return;
    }
    
    document.getElementById('adminModal').style.display = 'flex';
    loadAdminData();
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function showAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById('admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');

    // Load specific data
    if (tabName === 'users') {
        loadUsersList();
    } else if (tabName === 'recipes') {
        loadRecipesList();
    } else if (tabName === 'stats') {
        loadStatistics();
    }
}

function loadAdminData() {
    loadUsersList();
    loadStatistics();
}

function loadUsersList() {
    const usersList = document.getElementById('usersList');
    const users = userDB.getAllUsers();
    
    usersList.innerHTML = users.map(user => `
        <div class="user-item ${!user.isActive ? 'inactive' : ''}">
            <div class="user-info">
                <strong>${user.name}</strong>
                <span class="user-role">${user.role}</span>
                <div class="user-details">
                    <span>Email: ${user.email}</span>
                    <span>Username: ${user.username}</span>
                    <span>Joined: ${new Date(user.dateCreated).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="user-actions">
                ${user.id !== 'admin' ? `
                    <button onclick="toggleUserStatus('${user.id}')" class="admin-btn ${user.isActive ? 'deactivate' : 'activate'}">
                        ${user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onclick="deleteUserAccount('${user.id}')" class="admin-btn delete">Delete</button>
                ` : '<span class="admin-label">System Admin</span>'}
            </div>
        </div>
    `).join('');
}

function loadRecipesList() {
    const recipesList = document.getElementById('recipesList');
    const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
    const allRecipes = {...window.recipeDatabase, ...userRecipes};
    
    recipesList.innerHTML = Object.values(allRecipes).map(recipe => `
        <div class="recipe-item">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-thumb">
            <div class="recipe-info">
                <strong>${recipe.title}</strong>
                <span>Category: ${recipe.category}</span>
                <span>Created: ${recipe.dateAdded ? new Date(recipe.dateAdded).toLocaleDateString() : 'Sample'}</span>
            </div>
            <div class="recipe-actions">
                <button onclick="viewRecipe('${recipe.id}')" class="admin-btn">View</button>
                ${recipe.dateAdded ? `<button onclick="deleteRecipe('${recipe.id}')" class="admin-btn delete">Delete</button>` : ''}
            </div>
        </div>
    `).join('');
}

function loadStatistics() {
    const users = userDB.getAllUsers();
    const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalRecipes').textContent = Object.keys(userRecipes).length + Object.keys(window.recipeDatabase || {}).length;
    document.getElementById('activeSessions').textContent = userDB.currentUser ? '1' : '0';
}

// Admin Actions
function toggleUserStatus(userId) {
    const user = userDB.users[userId];
    if (user.isActive) {
        userDB.deactivateUser(userId);
        showSuccessMessage(`User ${user.name} deactivated`);
    } else {
        userDB.activateUser(userId);
        showSuccessMessage(`User ${user.name} activated`);
    }
    loadUsersList();
}

function deleteUserAccount(userId) {
    const user = userDB.users[userId];
    if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
        userDB.deleteUser(userId);
        showSuccessMessage(`User ${user.name} deleted`);
        loadUsersList();
        loadStatistics();
    }
}

function deleteRecipe(recipeId) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
        delete userRecipes[recipeId];
        localStorage.setItem('userRecipes', JSON.stringify(userRecipes));
        showSuccessMessage('Recipe deleted successfully');
        loadRecipesList();
        loadStatistics();
    }
}

// Profile Functions
function showProfile() {
    if (!userDB.currentUser) {
        openLoginModal();
        return;
    }
    
    alert(`Profile: ${userDB.currentUser.name}\nEmail: ${userDB.currentUser.email}\nJoined: ${new Date(userDB.currentUser.dateCreated).toLocaleDateString()}`);
}

function showMyRecipes() {
    if (!userDB.currentUser) {
        openLoginModal();
        return;
    }
    
    // Filter user's recipes
    const userRecipes = JSON.parse(localStorage.getItem('userRecipes')) || {};
    const myRecipes = Object.values(userRecipes).filter(recipe => 
        recipe.authorId === userDB.currentUser.id
    );
    
    if (myRecipes.length === 0) {
        alert('You haven\'t created any recipes yet. Click "Add Recipe" to get started!');
    } else {
        alert(`You have ${myRecipes.length} recipe(s): \n${myRecipes.map(r => r.title).join('\n')}`);
    }
}

// Utility Functions
function clearAuthErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
}

function clearAuthForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function showSuccessMessage(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 2000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debug Functions (for development)
function viewUserDatabase() {
    console.log('=== USER DATABASE ===');
    console.table(userDB.users);
    
    console.log('\n=== CURRENT USER ===');
    console.log(userDB.currentUser);
    
    console.log('\n=== DATABASE STATS ===');
    console.log(`Total Users: ${Object.keys(userDB.users).length}`);
    console.log(`Active Users: ${Object.values(userDB.users).filter(u => u.isActive).length}`);
    console.log(`Admin Users: ${Object.values(userDB.users).filter(u => u.role === 'admin').length}`);
    
    return userDB.users;
}

function exportUserData() {
    const data = {
        users: userDB.users,
        currentUser: userDB.currentUser,
        timestamp: new Date().toISOString()
    };
    
    console.log('=== EXPORTED USER DATA ===');
    console.log(JSON.stringify(data, null, 2));
    
    return data;
}

function clearUserDatabase() {
    if (confirm('Are you sure you want to clear ALL user data? This cannot be undone!')) {
        localStorage.removeItem('recipeBookUsers');
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// Export functions for global access
window.openLoginModal = openLoginModal;
window.openSignupModal = openSignupModal;
window.closeAuthModals = closeAuthModals;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.logout = logout;
window.showAdminPanel = showAdminPanel;
window.closeAdminModal = closeAdminModal;
window.showAdminTab = showAdminTab;
window.showProfile = showProfile;
window.showMyRecipes = showMyRecipes;
window.userDB = userDB;

// Debug functions
window.viewUserDatabase = viewUserDatabase;
window.exportUserData = exportUserData;
window.clearUserDatabase = clearUserDatabase;
