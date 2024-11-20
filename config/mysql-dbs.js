import mysql from 'mysql'
import config from './load-config.js'

const connection = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME
})


const connectMysql = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Kết nối thất bại: ', err);
            return;
        }
        console.log('Kết nối thành công đến MySQL trên AWS!');
    });
}


export default connectMysql;


