import mongoose from 'mongoose';
import crypto from 'crypto';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: 'Text is required'
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: String,
        created: {
            type: Date,
            default: Date.now
        },
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }]
});

export default mongoose.model('Post', postSchema);