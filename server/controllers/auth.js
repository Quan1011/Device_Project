import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  const { name, email, password, password2 } = req.body;

  // Kiểm tra độ dài và ký tự của mật khẩu
  if (password.length > 6 || !/^\d+$/.test(password)) {
    res.status(400).json({ error: "Mật khẩu phải có độ dài tối đa 6 ký tự và chỉ sử dụng chữ số" });
    return;
  }

  try {
    // Băm mật khẩu và mật khẩu đặc biệt bất đồng bộ
    const hashedPassword = await bcryptjs.hash(password, 10);
    const hashedPassword2 = await bcryptjs.hash(password2, 10);

    // Tạo người dùng mới
    const newUser = new User({ name, email, password: hashedPassword, password2: hashedPassword2 });
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    if (error.name === "ValidationError" && error.errors.password) {
      // Xử lý lỗi xác thực password từ MongoDB
      res.status(400).json({ error: error.errors.password.message });
    } else {
      next(error);
    }
  }
};

export const logIn = async (req, res, next) => {
  const { email = "admin@gmail.com", password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong password!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const logInWithPassword2 = async (req, res, next) => {
  const { email = "admin@gmail.com", password2 } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng!'
      });
    }

    const validPassword2 = await bcryptjs.compare(password2, validUser.password2);
    if (!validPassword2) {
      return res.status(401).json({
        success: false,
        message: 'Sai mật khẩu đặc biệt!'
      });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const { password: pass, password2: pass2, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'strict' })
      .status(200)
      .json({
        success: true,
        message: 'Đăng nhập thành công với mật khẩu đặc biệt!',
        user: rest
      });

  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
