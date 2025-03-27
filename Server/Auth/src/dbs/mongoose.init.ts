import { ExecException } from "child_process";
import mongoose from "mongoose";
import { MONGODB_CONFIG } from "../configs/mongodb.config";

class MongooseDB {
  static instance: any;
  constructor() {
    this.connect();
  }

  async connect(type = "mongodb") {
    // Use MONGODB_URI from config
    const connectionString = MONGODB_CONFIG.URI;
    
    if (!connectionString) {
      throw new Error("MongoDB URI is missing in configuration");
    }
    
    console.log('Connecting to MongoDB with:', connectionString);

    mongoose.set("debug", true);

    try {
      const options = {
        maxPoolSize: 50,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        retryReads: true
        // Removed deprecated options
        // autoReconnect: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true
      };
      
      console.log('MongoDB connection options:', JSON.stringify(options));
      await mongoose.connect(connectionString, options);
      console.log("Successfully connected to MongoDB");

      // Test connection by querying Students collection
      if (mongoose.connection.db) {
        try {
          const collections = await mongoose.connection.db.listCollections().toArray();
          console.log('Available collections:', collections.map(c => c.name).join(', '));
          
          if (collections.some(c => c.name === 'Students')) {
            const count = await mongoose.connection.db.collection('Students').countDocuments();
            console.log(`Found Students collection with ${count} documents`);
          } else {
            console.log('Students collection does not exist yet');
          }
        } catch (err) {
          console.error('Error checking collections:', err);
        }
      }
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      console.error("Connection details:", {
        host: MONGODB_CONFIG.HOST,
        port: MONGODB_CONFIG.PORT,
        database: MONGODB_CONFIG.DATABASE_NAME,
        uri: MONGODB_CONFIG.URI
      });
    }

    // Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Try to reconnect after a delay
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        this.connect();
      }, 5000);
    });
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
  }

  static getInstance() {
    if (!MongooseDB.instance) {
      MongooseDB.instance = new MongooseDB();
    }
    return MongooseDB.instance;
  }
}

const MongoConnection = MongooseDB.getInstance;

export { MongoConnection };
