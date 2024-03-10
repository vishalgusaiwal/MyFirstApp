import dbErrorHandler from '../helpers/dbErrorHandler';
import Post from '../models/post.model';
import { IncomingForm } from 'formidable';
import fs from 'fs';


const listNewsFeed = async (req, resp) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    try {
        let posts = await Post.find({
            postedBy: {
                $in: req.profile.following
            }
        }).populate('comments.postedBy', '_id name').populate('postedBy', '_id name').sort('-created').exec();
        return resp.json(posts);
    } catch (err) {
        return resp.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}

const listByUser = async (req, resp) => {
    console.log("At line 25 in listByUser");
    try {
        let posts = await Post.find({ postedBy: req.profile._id }).populate('comments.postedBy', '_id name').populate('postedBy', '_id name').sort('-created').exec();
        return resp.json(posts);
    } catch (err) {
        return resp.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}
const create = async (req, resp, next) => {
    let form = new IncomingForm({ multiples: true });
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return resp.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        fields.text = fields.text.toString();
        let post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo[0].filepath);
            post.photo.contectType = files.photo[0].mimetype;
        }
        try {
            let result = await post.save();
            result.hashed_password = undefined;
            result.salt = undefined;
            return resp.json(result);
        } catch (err) {
            return resp.status(400).json({
                error: dbErrorHandler.getErrorMessage(err)
            });
        }
    });
}
const photo = (req, resp, next) => {
    resp.set("Content-Type", req.post.photo.ContentType);
    resp.send(req.post.photo.data);
}

const postByID = async (req, resp, next,id) => {
    try {
        let post = await Post.findById(id).populate('postedBy', '_id name').exec();
        if (!post) {
            return resp.status(400).json({
                error: "Post not found"
            });
        }
        req.post = post;
        next();
    } catch (err) {
        return resp.status(400).json({
            error: "Could not retrieve user post"
        });
    }
}
const isPoster = (req, resp, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    console.log(isPoster);
    if (!isPoster) {
        return resp.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
}
const remove = async (req, resp) => {
    let post = req.post;
    console.log(post);
    try {
        let deletedPost = await Post.deleteOne({ _id: post._id });
        return resp.json(deletedPost);
    } catch (err) {
        return resp.json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}

const like = async (req, resp) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $push: { likes: req.body.userId } },
            { new: true }
        );
        return resp.json(result);
    } catch (err) {
        return resp.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}

const unlike = async (req, resp) => {
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $pull: { likes: req.body.userId } },
            { new: true }
        );
        return resp.json(result);
    } catch (err) {
        return resp.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}
const comment = async (req, resp) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate('comments.postedBy', '_id name').populate('postedBy', '_id name').exec();
        return resp.json(result);
    } catch (err) {
        return resp.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}
const uncomment = async (req, resp) => {
    let comment = req.body.comment;
    try {
        let result = await Post.findByIdAndUpdate(req.body.postId,
            { $pull: { comments: { _id: comment._id } } },
            { new: true }
        ).populate('comments.postedBy', '_id name').populate('postedBy', '_id name').exec();
        return resp.json(result);
    } catch (err) {
        return resp.status(400).json({
            error: dbErrorHandler.getErrorMessage(err)
        });
    }
}
export default {
    listNewsFeed, listByUser, create, postByID, photo, isPoster, remove, like, unlike, comment, uncomment
};