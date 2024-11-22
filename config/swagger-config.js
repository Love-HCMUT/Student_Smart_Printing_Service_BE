import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/load-config.js'

// Định nghĩa __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = config.PORT

// Cấu hình Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'A simple Express API documentation',
        },
        servers: [
            {
                url: `http://localhost:${port}`, // URL của server
            },
        ],
    },
    apis: [path.resolve(__dirname, '../doc/*.yml')], // Sử dụng __dirname để tạo đường dẫn chính xác
};

export default swaggerOptions;
