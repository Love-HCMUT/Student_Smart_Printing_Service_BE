import { createClient } from 'redis';
import config from './load-config';
const client = createClient({
    password: config.REDIS_PASS,
    socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT
    }
});

export function connectRedis() {
    client.on('error', (err) => {
        console.error(`An error occurred with Redis: ${err}`)
        return
    })
    console.log('Connected to Redis!');
}

export default client;