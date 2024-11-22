export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        // Session tồn tại, tiếp tục xử lý
        return next();
    }
    return res.status(401).json(createResponse(false, "Unauthorized access"));
};
