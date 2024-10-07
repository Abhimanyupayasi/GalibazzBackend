import express from 'express';
import ourGoals from './jsons/homepage.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import User from './models/user.model.js';
import postRouter from './routers/post.router.js';
const app = express();
import axios from 'axios';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fetchPostById, newestPosts } from './controllers/post.controller.js';
import Post from './models/post.model.js';
import { Server } from 'socket.io'; // Add Socket.IO
import http from 'http'; // Add http to create a server
import { count } from 'console';
dotenv.config();

app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
));

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello from Galibazz api');
});


const client = jwksClient({
  jwksUri: process.env.AUTH0_JWKS_URI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

app.post('/verify-token', async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: process.env.AUTH0_ISSUER,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

   // console.log(decoded);

    if (decoded && decoded.email) {
      const existingUser = await User.findOne({ email: decoded.email });

      if (!existingUser) {
        const user = new User({
          email: decoded.email,
          username: decoded.name // Ensure this field is provided
        });

        await user.save();
        //console.log('User saved successfully');
      } else {
        //console.log('User already exists');
      }
      
      return res.status(200).json({ message: 'Token is valid', decoded });
    } else {
      return res.status(400).json({ message: 'Email is required' });
    }
  } catch (err) {
    //console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Token is invalid', error: err });
  }
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
 // console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: process.env.AUTH0_ISSUER,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    //console.log(decoded);

    if (decoded && decoded.email) {
      req.user = decoded;
      next();
    } else {
      return res.status(400).json({ message: 'Email is required' });
    }
  } catch (err) {
    //console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Unauthorized', error: err });
  }

}

app.get('/api/p/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const post = await Post.findById(id);

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/delete/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
      const post = await Post.findByIdAndDelete(id);

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.get('/postEmail/:email',authMiddleware, async (req, res) => {
  const { email } = req.params;

  try {
      const post = await Post.find({
          userEmail: email
      });

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}
);
    


app.get('/api/newpost', newestPosts);



app.use('/api/post', authMiddleware,  postRouter);

app.post('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { text, userEmail, userName } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Validate that all required fields are provided
    if (!text || !userEmail || !userName) {
      return res.status(400).json({ message: 'All fields (text, userEmail, userName) are required' });
    }

    // Add the comment to the post's comments array
    post.comments.push({ text, userEmail, userName, postId: postId }); // Add postId to comment if needed
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch comments sorted by createdAt in descending order (newest first)
    const sortedComments = post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Alternatively, you can sort directly in MongoDB using aggregate
    // const sortedComments = await Post.aggregate([
    //   { $match: { _id: postId } },
    //   { $unwind: '$comments' },
    //   { $sort: { 'comments.createdAt': -1 } }
    // ]);

    res.status(200).json(sortedComments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


app.get('/api/post/:id/:commentId', async (req, res) => {
  const { id, commentId } = req.params;

  try {
      const post = await Post.findById(id);

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      const comment = post.comments.find((comment) => comment._id == commentId);

      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      delete comment.postId;

      res.status(200).json(comment);

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

app.delete('/api/post/:id/:commentId', async (req, res) => {
  const { id, commentId } = req.params;

  try {
      const post = await Post.findById(id);

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      const comment = post.comments.find((comment) => comment._id == commentId);

      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      post.comments = post.comments.filter((comment) => comment._id != commentId);



      await post.save();

      res.status(200).json({ message: 'Comment deleted successfully' });

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.get('/api/count/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get total number of comments
    const totalComments = post.comments.length;

    res.status(200).json({
      // comments: post.comments, 
      count:
      totalComments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});









export default app;