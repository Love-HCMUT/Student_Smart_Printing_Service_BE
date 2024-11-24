import { AccountService } from "../models/account.js";
import { createResponse } from "../config/api-response.js";
import bcrypt from "bcrypt";



export class AccountController {
    // Đăng ký tài khoản
    static async Register(req, res) {
        try {
            const { username, password, fullName, roles, phoneNumber, campus, building, room } = req.body;

            // Kiểm tra các trường bắt buộc
            if (!username || !password || !fullName || !roles) {
                return res.status(400).json(createResponse(false, "Missing required fields"));
            }

            // Kiểm tra tài khoản đã tồn tại
            const existingAccount = await AccountService.findAccountByUsername(username);
            if (existingAccount) {
                return res.status(400).json(createResponse(false, "Username is already taken"));
            }

            // Hash mật khẩu
             const hashedPassword = await bcrypt.hash(password, 10);
            // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            let accountId;
            // Thêm tài khoản vào database
            if (roles === "Lecture" || roles === "Student") {
                const type = "User";
                accountId = await AccountService.addAccount(username, hashedPassword, fullName, type);
            } else {
                accountId = await AccountService.addAccount(username, hashedPassword, fullName, roles);
            }
            

            // Xử lý thêm thông tin theo vai trò (roles)
            if  (roles === "Lecture" || roles === "Student") {
                await AccountService.addCustomer(accountId);
            } else if (roles === "SPSO") {
                await AccountService.addSPSO(accountId);
                if (phoneNumber) {
                    await AccountService.addSPSOPhoneNumber(accountId, phoneNumber);
                }
            } else if (roles === "Printing Staff") {
                if (!campus || !building || !room) {
                    return res.status(400).json(createResponse(false, "Location is missing"));
                }

                // Thêm thông tin vị trí cho nhân viên in ấn
                let locationID = await AccountService.findOrAddLocation(campus,building,room);
                if (locationID == 0) {
                    locationID = await AccountService.addLocation(campus, building, room);
                }
                await AccountService.addStaff(accountId, locationID);

                if (phoneNumber) {
                    await AccountService.addStaffPhoneNumber(accountId, phoneNumber);
                }
            } else {
                return res.status(400).json(createResponse(false, "Invalid roles"));
            }

            return res.status(201).json(createResponse(true, "Account registered successfully"));
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json(createResponse(false, "An error occurred while registering the account"));
        }
    }

    // Đăng nhập tài khoản
    static async Login(req, res) {
        try {
            const { username, password } = req.body;
    
            // Kiểm tra đầu vào
            if (!username || !password) {
                return res.status(400).json(createResponse(false, "Username and password are required"));
            }
    
            // Tìm tài khoản
            const account = await AccountService.findAccountByUsername(username);
            if (!account) {
                return res.status(401).json(createResponse(false, "Invalid username or password"));
            }
    
            // Kiểm tra mật khẩu với bcrypt.compare
            const isPasswordValid = await bcrypt.compare(password, account.accountPassword);
            console.log("Input password:", password);  // Debugging
            console.log("Stored hashed password:", account.accountPassword);  // Debugging
            console.log("Password comparison result:", isPasswordValid);  // Debugging
    
            // Kiểm tra kết quả so sánh
            if (!isPasswordValid) {
                return res.status(401).json(createResponse(false, "Invalid username or password"));
            }
            
    
            // Lưu thông tin người dùng vào session
            req.session.user = {
                id: account.id,
                username: account.username,
                roles: account.roles,
            };
    
            return res.status(200).json(createResponse(true, "Login successful"));
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json(createResponse(false, "An error occurred during login"));
        }
    }

    static async Logout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Logout error:", err);
                    return res.status(500).json(createResponse(false, "Failed to logout"));
                }
    
                return res.status(200).json(createResponse(true, "Logout successful"));
            });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json(createResponse(false, "An error occurred during logout"));
        }
    }
}