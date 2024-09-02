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

const PostSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String, required: true },
    type: { type: String },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model('Post', PostSchema);

