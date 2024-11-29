import Valkey from "ioredis";
import config from "./load-config.js";

const redis = new Valkey(config.REDIS_URI);

export function connectRedis() {
    redis.on('error', (err) => {
        console.error(`An error occurred with Redis: ${err}`)
        return
    })
    console.log('Kết nối thành công đến Redis!');
}

export default redis