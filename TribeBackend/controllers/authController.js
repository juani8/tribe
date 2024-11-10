const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMagicLink } = require('../utils/magicLink');

// Registration
exports.register = async (req, res) => {
    try {
        console.log('Register route hit')
        const { nickName, email, password } = req.body;
        console.log('Email provided for lookup:', email);
        const userExists = await User.findOne({ email });
        console.log('User exists:', userExists);
        if (userExists) return res.status(409).json({ message: 'User already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ nickName, email, password: hashedPassword });
        user.isVerified = false;
        await user.save();
        await sendMagicLink(user.email, user._id); // Function that sends a verification magic link
        res.status(200).json({ message: 'Registration successful. Magic Link sent.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.verifyMagicLink = async (req, res) => {
    console.log('Verify Magic Link Route Hit');
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.isVerified = true;  // Mark the user as verified
        console.log('User verified');
        await user.save();

        // If NODE_ENV is 'development' or there's no frontend URL, return JSON (for Postman testing)
        if (process.env.NODE_ENV === 'development' || !process.env.FRONTEND_URL) {
            return res.status(200).json({ message: 'User verified successfully. You can now log in.' });
        } else {
            // Otherwise, redirect to the frontend initial configuration page
            const deepLinkUrl = `tribeapp://initial-configuration?token=${token}`;
            return res.redirect(302, deepLinkUrl);
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Request password reset (send magic link)
// This is the function that will handle requests made to /auths/sessions/passwords to request a password reset
// The user provides their email, and the magic link is sent.
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        await sendMagicLink(user.email, user._id); // Send password reset magic link
        res.status(200).json({ message: 'Magic link sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Verify magic link for password reset
// This is the function that will handle requests made to POST /auths/sessions/passwords/tokens.
// It checks if the token is valid and then redirects the user to the password reset page.
exports.verifyPasswordResetMagicLink = (req, res) => {
    const { token } = req.body;

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        // Check if the environment variable is set to development (for Postman) or if no frontend URL is set
        if (process.env.NODE_ENV === 'development' || !process.env.FRONTEND_URL) {
            // Return a JSON response for Postman
            return res.status(200).json({ message: 'Password reset link verified. You can now reset your password.', token });
        } else {
            // Otherwise, redirect to the frontend password reset page
            const deepLinkUrl = `https://tribe.com/reset-password?token=${token}`;
            return res.redirect(302, deepLinkUrl);
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Change password (after magic link verification)
// This is the function that will handle requests made to PATCH /auths/sessions/passwords.
// It verifies the token sent with the request and updates the password.
exports.changePasswordWithMagicLink = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token

        const user = await User.findById(decoded.id);
        console.log('Looking for user with ID:', decoded.id); // Log the user ID being searched
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (err) {
        console.error('Error in changePasswordWithMagicLink:', err); // Log any errors
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

exports.bypassLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: 'testuser@a.com' });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error in bypassLogin:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error.' });
    }
}; 

exports.createTestUser = async (res) => {
    try {  
        const userExists = await User.findOne({ email: 'testuser@a.com' });
        console.log('User exists:', userExists);
        if (userExists) return res.status(409).json({ message: 'User already registered.' });

      const testUserData = {
        name: 'Test',
        lastName: 'User',
        nickName: 'testuser',
        email: 'testuser@a.com',
        password: await bcrypt.hash('123', 10),
        isVerified: true,
        profileImage: null,
        coverImage: null,
        description: 'no me borren xd',
        gamificationLevel: null,
        following: [],
        followers: [],
        favorites: [],
        numberOfFollowers: 0,
        numberOfFollowing: 0,
        numberOfComments: 0,
        numberOfFavorites: 0,
      };
   
      const testUser = new User(testUserData);
      await testUser.save();
      console.log('Test user created successfully:', testUser);
 
    } catch (error) {
      console.error('Error creating test user:', error);
      process.exit(1);
    }
  };

// Function to validate the token
exports.validateToken = async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token is invalid or expired' });
  }
};