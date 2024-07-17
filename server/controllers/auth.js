import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (password.length > 6 || !/^\d+$/.test(password)) {
    res.status(400).json({ error: "Mật khẩu phải tối đa 6 ký tự và chỉ sử dụng chữ số" });
    return;
  }   
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  }catch (error) {
    if (error.name === "ValidationError" && error.errors.password) {
        // Xử lý lỗi xác thực password từ MongoDB
        res.status(400).json({ error: error.errors.password.message });
    } else {
        next(error);
    }
  }
};

// export const signUp = async (req, res, next) => {
//   const { name, email, password, role } = req.body;

//   if (password.length > 6 || !/^\d+$/.test(password)) {
//     return res.status(400).json({ error: "Mật khẩu phải tối đa 6 ký tự và chỉ sử dụng chữ số" });
//   }

//   const hashedPassword = bcryptjs.hashSync(password, 10);
//   const newUser = new User({ name, email, password: hashedPassword, role });

//   try {
//     await newUser.save();
//     res.status(201).json('User created successfully!');
//   } catch (error) {
//     if (error.name === "ValidationError" && error.errors.password) {
//       res.status(400).json({ error: error.errors.password.message });
//     } else {
//       next(error);
//     }
//   }
// };


export const logIn = async (req, res, next) => {
  const {email= "admin@gmail.com", password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong password!'));
    const token = jwt.sign({ id: validUser._id }, process.env.MONGO);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// export const logIn = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const validUser = await User.findOne({ email });
//     if (!validUser) return next(errorHandler(404, 'User not found!'));

//     const validPassword = bcryptjs.compareSync(password, validUser.password);
//     if (!validPassword) return next(errorHandler(401, 'Wrong password!'));

//     const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.MONGO);
//     const { password: pass, ...rest } = validUser._doc;

//     res
//       .cookie('access_token', token, { httpOnly: true })
//       .status(200)
//       .json(rest);
//   } catch (error) {
//     next(error);
//   }
// };


export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};