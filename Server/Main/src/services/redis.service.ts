import { redisInstance } from "../dbs/redis.init";

type LockItem = {
  productId: string;
  quantity: number;
  cartId: string;
};

const acquireLock = async ({ productId, quantity, cartId }: LockItem) => {
  const client = redisInstance.getRedis();
  if (!client) {
    throw new Error("client is not ready");
  }

  const key = `lock:${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;
  console.log("start acquire");
  for (let i = 0; i < retryTimes; i++) {
    const result = await client.setNX(key, expireTime.toString());
    if (result) {
      //inventory interacting
      // const modifiedCount = await reserveInventory(cartId, quantity, productId);

      // if (modifiedCount) {
      //   await client.pExpire(key, expireTime);
      //   return key;
      // }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (key: string) => {
  const client = redisInstance.getRedis();
  if (!client) {
    throw new Error("client is not ready");
  }
  return await client.del(key);
};

export { acquireLock, releaseLock };
