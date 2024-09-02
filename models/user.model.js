import mongoose  from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})

export default mongoose.model('User', UserSchema);

// models/post.model.js
