const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const nodemailer = require('nodemailer');

const adminLayout = '../views/layouts/admin';
const authMiddleware = require('../../middleware/authMiddleware');
/**
 * GET
 * HOME
 */
router.get('/', async (req, res) => {
  try {
    const locals = {
      title: 'NodeJs Blog',
      description: 'A project using Node JS and MongoDB',
    };

    let perPage = 4;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { _id: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET
 * Post:id
 */
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;
    const isLoggedIn = req.userId != null;

    // Validate slug to ensure it's a 24-char hex string
    if (!/^[0-9a-fA-F]{24}$/.test(slug)) {
      return res.status(400).send('Invalid ID format');
    }

    const data = await Post.findById(slug);

    const locals = {
      title: data.title,
      description: 'A project using Node JS and MongoDB',
    };

    res.render('post', {
      locals,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST
 * Search
 */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: 'Search',
      description: 'A project using Node JS and MongoDB',
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { summary: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { tools: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      ],
    });

    if (data.length === 0) {
      locals.noResults = true;
    }

    res.render('search', { locals, data });
  } catch (error) {
    console.log(error);
  }
});

// const html = `
// <h1>Hello World</h1>
// <p>Isn't NodeMailer useful?
// `;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// async function mail() {
//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: process.env.EMAIL_USER,
//     subject: 'New Message wooo!',
//     // text: `Message from ${name} (Email: ${email}): ${message}`,
//     html: html,
//   });

//   console.log('Message sent' + info.messageId);
// }

// mail().catch(e => console.log(e));

router.post('/submit-form', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to: process.env.EMAIL_USER, // Your email, to receive messages
      subject: `New Message from ${name}`,
      html: `<p>You have received a new message from:</p>
                 <p>Name: ${name}</p>
                 <p>Email: ${email}</p>
                 <p>Message: ${message}</p>`,
    });
    console.log('Message sent: ' + info.messageId);
    res.redirect('/thanks');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to send message.');
  }
});

router.get('/thanks', (req, res) => {
  res.render('thanks');
});

// router.get('', async (req, res) => {
//   try {
//     const locals = {
//       title: 'NodeJs Blog',
//       description: 'A project using Node JS and MongoDB',
//     };
// const data = await Post.findById(_id)
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });

// function insertPostData() {
//   Post.insertMany([
//     {
//       image: 'https://sashacode11.github.io/falling-leaves/falling-leaves.png',
//       title: 'Falling leaves using JavaScript',
//       summary:
//         'Falling leaves that I created for a fun and relaxing project which using Vanila Javascipt',
//       body: 'A project using JavaScript',
//       tools: ['JavaScript', 'CSS', 'HTML'],
//     },
//   ]);
// }
// insertPostData();

module.exports = router;
