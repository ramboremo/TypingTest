const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index'); // We'll keep this for the root API endpoint
const authRouter = require('./routes/auth');
const statsRouter = require('./routes/stats');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://typingtest:typingtest@typingtestcluster.w7xupcm.mongodb.net/typingTestDB?appName=TypingTestCluster', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- PRODUCTION SETUP ---
// 1. Point to the built Angular app
app.use(express.static(path.join(__dirname, 'frontend/dist/frontend/browser')));

// 2. Define the API routes
app.use('/', indexRouter); // This can be removed if you don't have a root '/' API route
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);

// 3. For any other request, send the Angular app's index.html file
// This is crucial for Angular's client-side routing to work on page refresh.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/frontend/browser/index.html'));
});

// Note: The old app.get('*') catch-all for debugging has been replaced by the one above.

// REMOVED the app.listen() block to prevent conflict with bin/www

module.exports = app;

