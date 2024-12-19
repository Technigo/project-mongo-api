import { User } from "../models/userModel.js";

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a specific user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST (create) a new user
export const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Double-check for existing user (optional safeguard)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        response: `Email is already in use: ${existingUser.email}`,
      });
    }

    // Create and save new user
    const user = await new User(req.body).save();

    res.status(201).json({
      success: true,
      response: user,
      message: "User created successfully"
    }    );
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "User can't be created."
    });
  }
};

// PATCH (Partial Update) an existing user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure schema rules are enforced
    });

    if (!user) {
      return res.status(404).json({
      success: false,
      response: null,
      message: "User didn't found. Please add one."
    });
    }
    
    res.status(200).json({
      success: true,
      response: user,
      message: "User updated successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "User can't be updated. Please check again"
    });
  }
};

// PUT (Full Replace) - using findOneAndReplace
export const updateUserPut = async (req, res) => {
  try {
    const user = await User.findOneAndReplace(
      { _id: req.params.id }, // Find user by ID
      req.body, // Replace with new data
      {
      new: true, // Return the updated document
      overwrite: true, // Overwrite the entire document
      runValidators: true, // Ensure schema rules are enforced
    });

    if (!user) {
      return res.status(404).json({
      success: false,
      message: "User didn't found. Please add one."
    });
    }
    
    res.status(200).json({
      success: true,
      response: user,
      message: "User replaced successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "User can't be replaced. Please check again"
    });
  }
};