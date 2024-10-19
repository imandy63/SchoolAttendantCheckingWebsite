import * as redis from "redis";
import { RedisConfig } from "../configs/redis.config";

type RedisClient = ReturnType<typeof redis.createClient>;

class Redis {
  private client: { instanceConnect: RedisClient | null } = {
    instanceConnect: null,
  };
  private static instance: Redis | null = null;
  private connectionStatus = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  };
  private connectionAttempts = 0;
  private maxAttempts = 10;

  getInstance = () => {
    if (Redis.instance === null) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  };

  async set(key: string, value: string, time = 3600000) {
    if (!!this.client.instanceConnect) {
      await this.client.instanceConnect.set(key, value, {
        PX: time, // Expiration time in milliseconds
      });
      return true;
    } else {
      return false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!!this.client.instanceConnect) {
      return await this.client.instanceConnect.get(key);
    } else {
      return null;
    }
  }

  async delete(key: string) {
    if (!!this.client.instanceConnect) {
      await this.client.instanceConnect.del(key);
      return true;
    } else {
      return false;
    }
  }

  handleEventConnect = (redisConnection: RedisClient) => {
    redisConnection.on(this.connectionStatus.CONNECT, () => {
      console.log("Redis connection status::Connected");
    });

    redisConnection.on(this.connectionStatus.END, () => {
      console.log("Redis connection status::End");
    });

    redisConnection.on(this.connectionStatus.RECONNECT, () => {
      console.log("Redis connection status::Reconnect");
      this.connectionAttempts += 1;

      if (this.connectionAttempts > this.maxAttempts) {
        console.error("Max reconnection attempts reached. Stopping.");
        redisConnection.quit();
      }
    });

    redisConnection.on(this.connectionStatus.ERROR, (err: Error) => {
      console.log("Redis connection status::Error:", err);
    });
  };

  initRedis = () => {
    const { host, port } = RedisConfig;
    if (!host || !port) {
      throw new Error("Redis host or port is missing!");
    }

    const instanceRedis = redis.createClient({ socket: { host, port } });

    this.client.instanceConnect = instanceRedis;
    this.handleEventConnect(instanceRedis);
    instanceRedis.connect();
  };

  getRedis = () => {
    return this.client.instanceConnect;
  };

  closeRedis = () => {
    this.client.instanceConnect?.disconnect();
  };
}

const redisInstance = new Redis().getInstance();

export { redisInstance };
