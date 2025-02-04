import session from 'express-session';
import dotenv from 'dotenv'
dotenv.config()

export const sessionMiddleware = session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 1000,
    },
});
