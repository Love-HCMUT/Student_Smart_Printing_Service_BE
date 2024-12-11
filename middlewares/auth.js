import { createResponse } from "../config/api-response.js";


export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json(createResponse(false, "Unauthorized access"));
};


export const hasRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.roles === requiredRole) {
            return next();
        }
        res.status(403).json(createResponse(false, 'Forbidden. Insufficient permissions'));
    };
};
