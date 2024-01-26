import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "") {
        return res.status(400).json({ message: "Enter valid data in all fields" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Email is already in use
            return res.status(400).json({ message: "Email already in use" });
        }

        // Save the new user
        await newUser.save();
        res.json( "Sign up successful" );

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
