import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`Server is running on http://localhost:${env.PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `\n[ERROR] Port ${env.PORT} is already in use by another process.\n` +
          `Only one backend instance can run on port ${env.PORT}.\n` +
          `If an existing backend instance is running, please terminate it before restarting.\n`
        );
      } else {
        console.error(`\n[ERROR] Server error: ${error.message}\n`);
      }
      process.exit(1);
    });

    const shutdown = () => {
      console.log('\nShutting down backend server gracefully...');
      server.close(() => {
        console.log('Backend server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
