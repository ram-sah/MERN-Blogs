// Import required modules and packages
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
// Load environment variables from a .env file
dotenv.config();

// Connect to MongoDB using the provided connection string
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error(err);
    });

// Create an Express application
const app = express();

// Enable JSON body parsing for incoming requests
app.use(express.json());
// enabling to parse cookies from incoming HTTP requests
app.use(cookieParser());
// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

// Define routes for user, authentication and post using separate route files
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send JSON response with error details
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
