import mysql from 'mysql2'
import config from './load-config.js'

const dbs = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME,
    port: config.DB_PORT
})


export function connectMysql() {
    dbs.connect((err) => {
        if (err) {
            console.error('Kết nối thất bại: ', err);
            return;
        }
        console.log('Kết nối thành công đến MySQL trên BúThắngAI!');
    });
}


export default dbs;


