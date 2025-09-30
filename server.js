const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for add recipe page
app.get('/add-recipe.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'add-recipe.html'));
});

// Route for recipe detail page
app.get('/recipe-detail.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'recipe-detail.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log('🍳 Recipe Book Server is running!');
    console.log('');
    console.log('📱 Open your browser and visit:');
    console.log(`   http://localhost:${PORT}`);
    console.log('');
    console.log('📖 Available pages:');
    console.log(`   🏠 Homepage:     http://localhost:${PORT}`);
    console.log(`   ➕ Add Recipe:   http://localhost:${PORT}/add-recipe`);
    console.log(`   📄 Recipe Detail: http://localhost:${PORT}/recipe-detail`);
    console.log('');
    console.log('⏹️  Press Ctrl+C to stop the server');
    console.log('');
});