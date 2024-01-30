import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(await errorHandler(400, "Enter valid data in all fields"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Save the new user
    await newUser.save();
    res.json("Sign up successful");
  } catch (error) {
    next(error);
  }
};

//Signin

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, 'Enter valid data in all fields'));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'Invalid email or password'))
    }
    const isPasswordMatch = bcryptjs.compareSync(password, validUser.password);
    if (isPasswordMatch) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const { password: pass, ...rest } = validUser._doc;

      res.status(200).cookie('access_token', token, {
        httpOnly: true,
      }).json(rest)
    } else {
      next(errorHandler(401, "Invalid email or password"))
    }
  } catch (error) {
    next(error)
  }

}
