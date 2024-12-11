import { createResponse } from "../config/api-response.js";


export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        // Session tồn tại, tiếp tục xử lý
        return next();
    }
    return res.status(401).json(createResponse(false, "Unauthorized access"));
};


export const hasRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.roles === requiredRole) {
            return next(); // Người dùng có vai trò phù hợp
        }
        res.status(403).json(createResponse(false, 'Forbidden. Insufficient permissions'));
    };
};
