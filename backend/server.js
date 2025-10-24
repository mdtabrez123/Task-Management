import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

// --- Environment Variable Check (from our last fix) ---
const { PORT, MONGO_URI, JWT_SECRET } = process.env;

if (!PORT) {
  console.error('FATAL ERROR: PORT is not defined in .env file');
  process.exit(1);
}
if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env file');
  console.log('Please make sure MongoDB is running and your .env file is correct.');
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env file');
  process.exit(1);
}

// Start the server
const startServer = async () => {
  try {
    // Wait for the DB to connect before starting the server
    await connectDB(MONGO_URI);
    
    const app = express();

    // --- MODIFICATION: Configure CORS ---
    // Instead of app.use(cors()), we provide specific options
    // to only allow your frontend's origin.
    const corsOptions = {
      origin: 'http://localhost:5173',
      optionsSuccessStatus: 200 // for older browsers
    };
    app.use(cors(corsOptions));
    // --- END MODIFICATION ---

    app.use(express.json()); // Allow server to accept JSON

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);

    // Simple root route
    app.get('/', (req, res) => {
      res.send('Task Manager API is running...');
    });
    
    // Global Error Handlers (no change)
    process.on('unhandledRejection', (err, promise) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
    process.on('uncaughtException', (err) => {
      console.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Environment variables loaded successfully.');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();