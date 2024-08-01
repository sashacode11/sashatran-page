const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const adminLayout = '../views/layouts/admin';
const authMiddleware = require('../../middleware/authMiddleware');

/**
 * GET
 * Admin - Login Page
 */
router.get('/login', async (req, res) => {
  try {
    const locals = {
      title: 'Admin',
      description: 'A project using Node JS and MongoDB',
    };

    res.render('admin/login', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * Admin - Llogin
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * Admin - Register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already in use' });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET
 * Admin - Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'A project using Node JS and MongoDB',
    };
    const data = await Post.find();
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET
 * Admin - Create Post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'A project using Node JS and MongoDB',
    };
    res.render('admin/add-post', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * Admin - Create Post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    const toolsArray = req.body.tools.split(',').map(tool => tool.trim());

    const newPost = new Post({
      image: req.body.image,
      title: req.body.title,
      summary: req.body.summary,
      body: req.body.body,
      tools: toolsArray,
      projectUrl: req.body.projectUrl,
    });

    await Post.create(newPost);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT
 * Admin - Edit Post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const toolsArray = req.body.tools.split(',').map(tool => tool.trim());

    await Post.findByIdAndUpdate(req.params.id, {
      image: req.body.image,
      title: req.body.title,
      summary: req.body.summary,
      body: req.body.body,
      tools: toolsArray,
      projectUrl: req.body.projectUrl,
    });
    // res.redirect(`/edit-post/${req.params.id}`);
    // res.json({ success: true, message: 'Post updated successfully' });
    // res.redirect(`/dashboard?message=Post updated successfullly`);
    res.redirect(`../post/${req.params.id}?message=Post updated successfullly`);
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to update project');
    res.status(500).redirect(`/edit-post/${req.params.id}`);
  }
});

/**
 * GET
 * Admin - Edit Post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Edit Post',
      description: 'A project using Node JS and MongoDB',
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render('admin/edit-post', { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE
 * Admin - Edit Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE
 * Admin - Logout
 */
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});
module.exports = router;
