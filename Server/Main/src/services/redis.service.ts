import { redisInstance } from "../dbs/redis.init";

type LockItem = {
  id: string;
  callback: () => Promise<any>;
};
class RedisService {
  redis;
  static instance: RedisService;

  constructor() {
    this.redis = redisInstance;
  }

  static getInstance = () => {
    if (RedisService.instance == null) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  };

  acquireLock = async ({ id, callback }: LockItem) => {
    const key = `lock:${id}`;
    const retryTimes = 10;
    const expireTime = 2000;
    for (let i = 0; i < retryTimes; i++) {
      const result = await this.redis.get(key);
      if (!result) {
        const lock = await this.redis.set(key, "1", expireTime);
        if (lock) {
          const modifiedCount = await callback();
          if (modifiedCount) {
            await this.releaseLock(id);
            return key;
          }
          return null;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }
    return null;
  };

  releaseLock = async (id: string) => {
    return await this.redis.delete(`lock:${id}`);
  };
}

export { RedisService };
