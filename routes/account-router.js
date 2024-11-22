import express from "express";
import { AccountController } from "../controllers/account-controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Đăng ký
router.post("/register", AccountController.Register);

// Đăng nhập
router.post("/login", AccountController.Login);

// Đăng xuất
router.post("/logout", isAuthenticated, AccountController.Logout);


export default router;
