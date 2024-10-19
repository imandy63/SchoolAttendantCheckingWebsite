import { ExecException } from "child_process";
import mongoose from "mongoose";
import { MONGODB_CONFIG } from "../configs/mongodb.config";

class MongooseDB {
  static instance: any;
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    const host = MONGODB_CONFIG.HOST;
    const port = MONGODB_CONFIG.PORT;
    const databaseName = MONGODB_CONFIG.DATABASE_NAME;
    const connectionString = `mongodb://${host}:${port}/${databaseName}`;

    if (!host || !port || !databaseName) {
      throw new Error("Mongodb host or port or database name is missing");
    }

    if (1 === 1) {
      mongoose.set("debug", false);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString, {
        maxPoolSize: 50,
      })
      .then(() => console.log("Successfully"))
      .catch((err: ExecException) => {
        console.log("Error:" + err);
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
