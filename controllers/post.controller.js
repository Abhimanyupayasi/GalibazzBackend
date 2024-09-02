// controllers/postController.js
// import Post from '../models/post.model.js';

// const createPost = async (req, res) => {
//     const { title, content, type, userEmail } = req.body;
//     const post = new Post({
//         title,
//         content,
//         type,
//         userEmail
//     });

//     try {
//         await post.save();
//         res.status(201).json(post);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }



// export default createPost;

// export const fetchAllPosts = async (req, res) => {
//     try {
//         const posts = await Post.find().sort({ createdAt: -1 });
//         res.status(200).json(posts);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// controllers/postController.js
// import Post from '../models/post.model.js';

// export const createPost = async (req, res) => {
//     const { title, content, type, userEmail } = req.body;
//     const post = new Post({
//         title,
//         content,
//         type,
//         userEmail
//     });

//     try {
//         await post.save();
//         res.status(201).json(post);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const fetchAllPosts = async (req, res) => {
//     const { page = 1, limit = 20 } = req.query;
//     const pageInt = parseInt(page);
//     const limitInt = parseInt(limit);
    
//     try {
//         const posts = await Post.find()
//             .sort({ createdAt: -1 })
//             .skip((pageInt - 1) * limitInt)
//             .limit(limitInt);
        
//         const totalPosts = await Post.countDocuments();

//         res.status(200).json({
//             posts,
//             totalPages: Math.ceil(totalPosts / limitInt),
//             currentPage: pageInt,
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// controllers/postController.js
import Post from '../models/post.model.js';

export const createPost = async (req, res) => {
    const { title, content, type, userEmail, userName } = req.body;

    const post = new Post({
        title,
        content,
        type,
        userEmail,
        userName
    });

    try {
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchAllPosts = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt);

        const totalPosts = await Post.countDocuments();

        res.status(200).json({
            posts,
            totalPages: Math.ceil(totalPosts / limitInt),
            currentPage: pageInt,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


