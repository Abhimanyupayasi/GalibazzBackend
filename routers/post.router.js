 import { Router } from 'express';
import { createPost, fetchAllPosts } from '../controllers/post.controller.js';



 const postRouter = new Router();

    postRouter.get('/', (req, res) => {
        res.status(200).json({ message: 'Hello from the post router' });
    });

    postRouter.post('/create', createPost)
    postRouter.get('/all', fetchAllPosts);

    export default postRouter;
