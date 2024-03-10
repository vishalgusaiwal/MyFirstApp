import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import expressjwt from 'express-jwt';
import config from './../../config/config';


const signin = async (req, resp) => {
    try {
        let user = await User.findOne({ "email": req.body.email });
        if (!user) {
            return resp.status(401).json({ success: false, error: "User not found" });
        }
        if (!user.authenticate(req.body.password)) {
            return res.status(401).send({ success: false, error: "Email and password don't match" });
        }
        const token = jwt.sign({ _id: user._id }, config.jwtSecret);
        resp.cookie('t', token, { expire: new Date() + 9999 });

        return resp.json({
            success: true,
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        return resp.status(401).json({ success: false, error: "Could not sign in" });
    }
}

const signout = (req, resp) => {
    resp.clearCookie("t");
    return resp.status(200).json({
        success: true,
        message: "signed out successfully"
    });
}

const requireSignin = expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

const hasAthorization = (req, resp, next) => {
    console.log("has authorization function " + req);
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return resp.status(403).json({
            success: false,
            error: "User is not authorized"
        });
    }
    next();
}

export default { signin, signout, requireSignin, hasAthorization }