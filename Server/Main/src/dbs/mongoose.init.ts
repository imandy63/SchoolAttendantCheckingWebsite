import { ExecException } from "child_process";
import mongoose from "mongoose";
import { MONGODB_CONFIG } from "../configs/mongodb.config";

const connectionString = MONGODB_CONFIG.URI;

class MongooseDB {
  static instance: any;
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (!connectionString) {
      throw new Error("Mongodb URI is not provided or does not exist");
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

export { MongooseDB };
