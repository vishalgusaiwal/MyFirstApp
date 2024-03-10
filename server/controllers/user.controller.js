import User from '../models/user.model';
import extend from 'lodash/extend';
import errorHandler from './../helpers/dbErrorHandler';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import profileImage from './../../client/assets/images/defaultphoto.png';

/* List of apis */
const create = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Successfully signed up"
        });
    } catch(err) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(err)
        });
    }
}
const list = async (req, res) => {
    try {
        let user = await User.find().select('name email updated created');
        res.send({
            success: true,
            user: JSON.stringify(user)
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(err)
        });
    }
}
const userByID = async (req, res, next, id) => {
    /*if (req.path.includes('/api/users/defaultphoto') || req.path.includes('/api/users/follow') || req.path.includes('/api/users/unfollow')) {
        console.log("It worked!!!");
        return;
    }*/
    try {
        console.log("At line 46 user controller -> id is ->"+id);
        let user = await User.findById(id).populate('following', '_id name').populate('followers', '_id name').exec();
        if (!user) {
            return res.status(400).json({
                success: false,
                message:"User not found"
            });
        }
        req.profile = user;
        console.log("At line 55 No error found user controller");
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve user"
        });
    }
}
const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json({
        success: true,
        profile: req.profile
    });
}
const update = async (req, resp) => {
    console.log("At line 71 user controller");
    let form = new IncomingForm({ multiples: true });
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return resp.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        let user = req.profile;
        //console.log(user + "line 76");
        user = extend(user, req.body);
        //console.log(user + "line 78");
        user.about = fields.about || user.about;
        user.email = feilds.email || user.email;
        user.password = fields.password || user.password;
        user.about = user.about.toString();
        user.updated = Date.now();
        //console.log(user + "line 82");
        //console.log(files);
        if (files.photo) {
            //console.log(files.photo);
            user.photo.data = fs.readFileSync(files.photo[0].filepath);
            //console.log(user.photo.data);
            user.photo.contentType = files.photo[0].mimetype;
            //console.log(user.photo.contentType);
        }
        try {
            //console.log(user + "line 85");
            await user.save();
            //console.log(user + "line 73");
            user.hashed_password = undefined;
            user.salt = undefined;
            //console.log(user + "line 76");
            return resp.json({
                success: true,
                user: user
            });
        } catch (err) {
            return resp.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    });
}
const remove = async (req, resp) => {
    try {
        let user = req.profile;
        let deleteUser = await user.remove();
        deleteUser.hashed_password = undefined;
        deleteUser.salt = undefined;
        resp.send({
            success: true,
            user: deleteUser
        });
    } catch (err) {
        return resp.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const photo = (req, resp, next) => {
    console.log("At line 132 user controller");
    if (req.profile.photo.data) {
        resp.set("Content-Type", req.profile.photo.contentType);
        return resp.send(req.profile.photo.data);
    }
    next();
}
const defaultPhoto = (req, resp) => {
    console.log("At line 140 user controller");
    return resp.sendFile(process.cwd() + profileImage);
}

const addFollowing = async (req, resp, next) => {
    console.log("At line 145 user controller");
    try {
        await User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } });
        next();
    } catch (err) {
        return resp.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}
const addFollower = async (req, resp) => {
    console.log("At line 156 user controller");
    try {
        console.log(req.body.userId + "is defined? user controller");
        let result = await User.findByIdAndUpdate(req.body.followId,
            { $push: { followers: req.body.userId } },
            { new: true }).populate('following', '_id name').populate('followers', '_id name').exec();
        console.log(result +"user controller");
        result.hashed_password = undefined;
        result.salt = undefined;
        resp.json(result);
    } catch (err) {
        return resp.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}
const removeFollowing = async (req, resp,next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId,
            { $pull: { following: req.body.unfollowId } })
        next();
    } catch (err) {
        return resp.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}
const removeFollower = async (req, resp) => {
    try {
        let result = await User.findByIdAndUpdate(req.body.unfollowId,
            { $pull: { followers: req.body.userId } },
            { new: true }).populate('following', '_id name').populate('followers', '_id name').exec();
        result.hashed_password = undefined;
        result.salt = undefined;
        return resp.json(result);
    } catch (err) {
        return resp.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const findPeople = async (req, resp) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    try {
        let users = await User.find({ _id: { $nin: following } }).select('name');
        return resp.status(200).json(users);
    } catch (err) {
        return resp.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}


export default { create, list, userByID, read, update, remove, photo, defaultPhoto, addFollower, addFollowing, removeFollowing, removeFollower, findPeople }