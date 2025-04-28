require('dotenv').config();

// Function to validate required environment variables
const validateEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(
      `❌ Environment variable "${key}" is missing. Please define it in your .env.local file.`
    );
  }
  return process.env[key];
};

// Centralized Environment Configuration
const env = {
  database: {
    url: validateEnv("MONGO_URI"),
  },
  jwt: {
    secret: validateEnv("JWT_SECRET"),
    accessExpiry: validateEnv("JWT_ACCESS_EXPIRY"),
    refreshExpiry: validateEnv("JWT_REFRESH_EXPIRY"),
  },
  masterKey: validateEnv("MASTER_KEY"),
  cloudinary: {
    cloudName: validateEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: validateEnv("CLOUDINARY_API_KEY"),
    apiSecret: validateEnv("CLOUDINARY_API_SECRET"),
    folder: validateEnv("CLOUDINARY_FOLDER"),
  },
};

module.exports = env;
