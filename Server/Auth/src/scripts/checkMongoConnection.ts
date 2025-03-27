import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function checkMongoConnection() {
  console.log('=== MongoDB Connection Test ===');
  console.log('Connection details:');
  console.log('URI:', process.env.MONGODB_URI);
  console.log('Host:', process.env.MONGODB_HOST);
  console.log('Port:', process.env.MONGODB_PORT);
  console.log('Database:', process.env.MONGODB_DATABASE_NAME);

  try {
    const connectionString = process.env.MONGODB_URI;
    if (!connectionString) {
      throw new Error('MongoDB URI is missing in configuration');
    }

    console.log('Connecting to MongoDB with:', connectionString);

    const options = {
      maxPoolSize: 50,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true
    };

    await mongoose.connect(connectionString, options);
    console.log('Successfully connected to MongoDB');

    // Test connection by querying collections
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name).join(', '));
      
      // Check Students collection
      if (collections.some(c => c.name === 'Students')) {
        const count = await mongoose.connection.db.collection('Students').countDocuments();
        console.log(`Found Students collection with ${count} documents`);
        
        // Show sample document if available
        if (count > 0) {
          const sample = await mongoose.connection.db.collection('Students').findOne({});
          console.log('Sample document:', JSON.stringify(sample, null, 2));
        }
      } else {
        console.log('Students collection does not exist yet');
      }
    }

    await mongoose.disconnect();
    console.log('Test completed and disconnected from MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

checkMongoConnection();