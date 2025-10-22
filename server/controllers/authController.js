import { User } from '../models/User.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, birthDate } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: 'Email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      birthDate,
    });

    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          interests: user.interests || [],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password is incorrect',
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password is incorrect',
      });
    }

    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          interests: user.interests || [],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: 'Token verified',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          interests: user.interests || [],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
      // TODO: Implement email sending functionality
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Failed to send reset email',
        error: 'Email not found',
      });
    }

    // TODO: Implement email sending functionality
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { interests } = req.body;
    const userId = req.user._id;

    if (!interests || !Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array',
        error: 'Invalid input',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { interests },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User does not exist',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          interests: user.interests,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { avatarUrl } = req.body;
    const userId = req.user._id;

    if (!avatarUrl || typeof avatarUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required',
        error: 'Invalid input',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'User does not exist',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          birthDate: user.birthDate,
          avatar: user.avatar,
          interests: user.interests,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};