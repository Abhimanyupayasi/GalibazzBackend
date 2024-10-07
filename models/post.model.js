// // models/post.model.js
// import mongoose from 'mongoose';

// const PostSchema = new mongoose.Schema({
//     title: { type: String },
//     content: { type: String, required: true },
//     type: { type: String },
//     userEmail: { type: String, required: true },
//     userName: { type: String, required: true    }
// }
//     , {
//         timestamps: true
//     }
// );

// export default mongoose.model('Post', PostSchema);
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true }, // changed 'content' to 'text' for consistency
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', // assuming you're referencing the Post model
        
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model('Comment', CommentSchema);

const PostSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String, required: true },
    type: { type: String },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    comments: [CommentSchema],


}, {
    timestamps: true
});

export default mongoose.model('Post', PostSchema);

