const express = require('express');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.static(path.join(__dirname, 'public'))); // To serve CSS/JS files
app.use(methodOverride('_method')); // Allows PUT/DELETE via POST forms

// In-memory array to store blog posts
let posts = [
    { id: '1', title: 'First Blog Post', content: 'Welcome to my blog creation application built with Node.js and Express!' }
];

// READ: View all posts & the creation form
app.get('/', (req, res) => {
    res.render('index', { posts, editPost: null });
});

// CREATE: Add a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (title && content) {
        const newPost = {
            id: Date.now().toString(),
            title,
            content
        };
        posts.push(newPost);
    }
    res.redirect('/');
});

// EDIT FORM: Load a post into the form for editing
app.get('/posts/edit/:id', (req, res) => {
    const postId = req.params.id;
    const editPost = posts.find(p => p.id === postId);
    res.render('index', { posts, editPost });
});

// UPDATE: Save the edited post
app.put('/posts/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.title = title;
        post.content = content;
    }
    res.redirect('/');
});

// DELETE: Remove a post
app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});