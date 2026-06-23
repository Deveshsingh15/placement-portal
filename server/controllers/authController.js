// controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register student
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, college, branch, graduationYear } = req.body;
    console.log('[authController.register] request body:', { name, email, college, branch, graduationYear });

    const existingUser = await User.findOne({ email });
    console.log('[authController.register] existingUser:', existingUser ? { _id: existingUser._id, email: existingUser.email } : null);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, college, branch, graduationYear });
    console.log('[authController.register] createdUser:', { _id: user._id, email: user.email, role: user.role });

    const token = generateToken(user._id);
    console.log('[authController.register] token generated');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[authController.register] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login student
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[authController.login] request body:', { email });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    console.log('[authController.login] user lookup:', user ? { _id: user._id, email: user.email, role: user.role } : null);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('[authController.login] password compare result:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    console.log('[authController.login] token generated');

    const responsePayload = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        role: user.role,
        resume: user.resume,
        darkMode: user.darkMode,
      },
    };

    console.log('[authController.login] response payload:', responsePayload);
    res.json(responsePayload);
  } catch (error) {
    console.error('[authController.login] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('[authController.adminLogin] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    console.error('[authController.getMe] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'college', 'branch', 'graduationYear', 'phone', 'skills', 'targetCompanies', 'darkMode'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (error) {
    console.error('[authController.updateProfile] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
