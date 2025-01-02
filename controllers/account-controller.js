import { AccountService } from "../models/account.js";
import { createResponse } from "../config/api-response.js";
import bcrypt from "bcryptjs";

export class AccountController {
  // Đăng ký tài khoản
  static async Register(req, res) {
    try {
      const {
        username,
        password,
        fullName,
        roles,
        phoneNumber,
        campus,
        building,
        room,
        id,
      } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!username || !password || !fullName || !roles) {
        return res
          .status(400)
          .json(createResponse(false, "Missing required fields"));
      }


      const fullNamePattern = /^[A-Za-zÀ-ỹ\s]{2,}$/;
      if (!fullNamePattern.test(fullName)) {
        return res
          .status(400)
          .json(createResponse(false, "Full name is invalid. Must contain only letters and spaces, at least 2 characters."));
      }
      const usernamePattern = /^.{8,20}$/;
      if (!usernamePattern.test(username)) {
        return res
          .status(400)
          .json(createResponse(false, "Username is invalid. Must be between 8 and 20 characters."));
      }
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,20}$/;

      if (!password || !passwordPattern.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must include at least 1 uppercase character, 1 lowercase character, 1 number, and be between 8 and 20 characters long without spaces."
        });
      }
      const phonePattern = /[0-9]{10,11}/;

      // Kiểm tra tài khoản đã tồn tại
      const existingAccount = await AccountService.findAccountByUsername(
        username
      );

      if (existingAccount) {
        return res
          .status(400)
          .json(createResponse(false, "Username is already taken"));
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      // const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      let accountId;
      // Thêm tài khoản vào database
      if (roles === "Lecture" || roles === "Student") {
        const type = "User";
        accountId = await AccountService.addAccount(
          username,
          hashedPassword,
          fullName,
          type
        );
        console.log("account: ", accountId)
      } else {
        accountId = await AccountService.addAccount(
          username,
          hashedPassword,
          fullName,
          roles
        );
      }


      // Xử lý thêm thông tin theo vai trò (roles)
      if (roles === "Lecture" || roles === "Student") {
        await AccountService.addCustomer(accountId);
      } else if (roles === "SPSO") {
        await AccountService.addSPSO(accountId);
        if (!phoneNumber || !phonePattern.test(phoneNumber)) {
          return res.status(400).json({
            success: false,
            message: "Phone number must contain exactly 10 or 11 digits.",
          });
        }
        if (phoneNumber) {
          await AccountService.addSPSOPhoneNumber(accountId, phoneNumber);
        }
      } else if (roles === "Printing Staff") {
        if (!campus || !building || !room) {
          return res
            .status(400)
            .json(createResponse(false, "Location is missing"));
        }

        // Thêm thông tin vị trí cho nhân viên in ấn
        let locationID = await AccountService.findOrAddLocation(
          campus,
          building,
          room
        );
        if (locationID == 0) {
          locationID = await AccountService.addLocation(campus, building, room);
        }
        await AccountService.addStaff(accountId, id, locationID);
        if (!phoneNumber || !phonePattern.test(phoneNumber)) {
          return res.status(400).json({
            success: false,
            message: "Phone number must contain exactly 10 or 11 digits.",
          });
        }
        if (phoneNumber) {
          await AccountService.addStaffPhoneNumber(accountId, phoneNumber);
        }
      } else {
        return res.status(400).json(createResponse(false, "Invalid roles"));
      }

      return res
        .status(201)
        .json(createResponse(true, "Account registered successfully"));
    } catch (error) {
      console.error("Register error:", error);
      return res
        .status(500)
        .json(
          createResponse(
            false,
            "An error occurred while registering the account"
          )
        );
    }
  }

  // Đăng nhập tài khoản
  static async Login(req, res) {
    try {
      const { username, password } = req.body;

      // Kiểm tra đầu vào
      if (!username || !password) {
        return res
          .status(400)
          .json(createResponse(false, "Username and password are required"));
      }

      // Tìm tài khoản
      const account = await AccountService.findAccountByUsername(username);
      // console.log(account);
      if (!account) {
        return res
          .status(401)
          .json(createResponse(false, "Invalid username or password"));
      }

      // Kiểm tra mật khẩu với bcrypt.compare
      const isPasswordValid = await bcrypt.compare(
        password,
        account.accountPassword
      );

      // Kiểm tra kết quả so sánh
      if (!isPasswordValid) {
        return res
          .status(401)
          .json(createResponse(false, "Invalid username or password"));
      }

      // Lưu thông tin người dùng vào session
      req.session.user = {
        id: account.id,
        username: account.fullName,
        roles: account.roles,
      };


      const data = {
        id: account.id,
        username: account.fullName,
        roles: account.roles,
      };

      req.session.save((err) => {
        if (err) {
          console.error('Không thể lưu session:', err);
          return res.status(500).send('Có lỗi xảy ra');
        }
        console.log("add session successfully ", req.session)
        return res.status(200).json(createResponse(true, "Login successful", data));
      });

    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json(createResponse(false, "An error occurred during login"));
    }
  }

  static async Login_GG(req, res) {
    try {
      const { username } = req.body;

      // Kiểm tra đầu vào
      if (!username) {
        return res
          .status(400)
          .json(createResponse(false, "Username  are required"));
      }

      // Tìm tài khoản
      const account = await AccountService.findAccountByUsername(username);
      if (!account) {
        return res.status(401).json(createResponse(false, "Invalid username"));
      }

      // Lưu thông tin người dùng vào session
      req.session.user = {
        id: account.id,
        username: account.username,
        roles: account.roles,
      };

      const data = {
        id: account.id,
        username: account.username,
        roles: account.roles,
      };

      req.session.save((err) => {
        if (err) {
          console.error('Không thể lưu session:', err);
          return res.status(500).send('Có lỗi xảy ra');
        }
        return res.status(200).json(createResponse(true, "Login successful", data));
      });

    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json(createResponse(false, "An error occurred during login"));
    }
  }

  static async Logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res
            .status(500)
            .json(createResponse(false, "Failed to logout"));
        }

        res.clearCookie('connect.sid', {
          httpOnly: true,
          secure: false, // Bật `true` nếu dùng HTTPS
          sameSite: 'strict',
        });
        console.log("delete cookie")

        return res.status(200).json(createResponse(true, "Logout successful"));
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res
        .status(500)
        .json(createResponse(false, "An error occurred during logout"));
    }
  }
}
