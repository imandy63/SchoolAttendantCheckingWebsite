import * as redis from "redis";
import { RedisConfig } from "../config/config.redis";

type RedisClient = ReturnType<typeof redis.createClient>;

class Redis {
  private client: { instanceConnect: RedisClient | null } = {
    instanceConnect: null,
  };
  private connectionStatus = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  };

  handleEventConnect = (redisConnection: RedisClient) => {
    redisConnection.on(this.connectionStatus.CONNECT, () => {
      console.log("Redis connection status::Connected");
    });

    redisConnection.on(this.connectionStatus.END, () => {
      console.log("Redis connection status::End");
    });

    redisConnection.on(this.connectionStatus.RECONNECT, () => {
      console.log("Redis connection status::Reconnect");
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

const redisInstance = new Redis();

export { redisInstance };
