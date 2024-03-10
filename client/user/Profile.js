import { useEffect, useState } from "react";
import { Link , useParams , useNavigate } from "react-router-dom";
import * as auth from './../auth/auth-helper';
import { read } from "./api-user";
import * as Mui from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import Person from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from '../post/api-post';


const useStyles = makeStyles(theme => ({
    card: {
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    }
}));
const Profile = () => {
    const [user, setUser] = useState({});
    const [values, setValues] = useState({
        following: [],
        followers: []
    });
    const [following, setFollowing] = useState(false);
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const classes = useStyles();
    const params = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const photoUrl = user._id
        ? `/api/users/photo/${user._id}?${new Date().getTime}`
        : '/api/user/defaultphoto/';
    console.log(params);
    const checkFollow = (user) => {
        const jwt = auth.isAuthenticated();
        const match = user.followers.some((follower) => {
            return follower._id == jwt.user._id;
        });
        return match;
    }
    const clickFollowButton = (callApi) => {
        const jwt = auth.isAuthenticated();
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, user._id).then((data) => {
            if (data.error) {
                setRedirectToSignin(true);
            } else {
                setFollowing(!following);
                setUser(data);
            }
        })
    }
    const removePost = (post) => {
        const updatedPosts = posts;
        const index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    }
    const loadPost = (user) => {
        const jwt = auth.isAuthenticated();
        listByUser({
            userId: user
        }, {
            t: jwt.token
        }).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setPosts(data);
            }
        });
    }
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = auth.isAuthenticated();
        read({
            userId: params.userId
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
            } else {
                let following = checkFollow(data.profile);
                setFollowing(following);
                setUser(data.profile);
                setValues({ ...values, following: data.profile.following, followers: data.profile.followers });
                loadPost(data.profile._id);
            }
        });
        return () => {
            abortController.abort();
        }
    }, [params.userId]);
    if (redirectToSignin) navigate('/signin');
    
    return (
        <div>
            <Mui.Card className={classes.card}>
                <Mui.Typography variant="h6" className={classes.title}>
                    Profile
                </Mui.Typography>
                <Mui.List dense>
                    <Mui.ListItem>
                        <Mui.ListItemAvatar>
                            <Mui.Avatar src={photoUrl}>
                                <Person />
                            </Mui.Avatar>
                        </Mui.ListItemAvatar>
                        <Mui.ListItemText primary={user.name} secondary={user.email} />
                        {
                            auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id ? (
                                <Mui.ListItemSecondaryAction>
                                    <Link to={"/user/edit/" + user._id}>
                                        <Mui.IconButton aria-label="Edit" color="primary">
                                            <Edit />
                                        </Mui.IconButton>
                                    </Link>
                                    <DeleteUser userId={user._id} />
                                </Mui.ListItemSecondaryAction>
                            ) : <FollowProfileButton following={following} onButtonClick={clickFollowButton} />
                        }
                    </Mui.ListItem>
                    <Mui.Divider />
                    <Mui.ListItem>
                        <Mui.ListItemText primary={"Joined: " + (
                            new Date(user.created)).toDateString()} />
                    </Mui.ListItem>
                    <Mui.ListItem>
                        <Mui.ListItemText primary={user.about} />
                    </Mui.ListItem>
                </Mui.List>
                <ProfileTabs user={values} posts={posts} removePostUpdate={removePost} />
            </Mui.Card>
        </div>
    );
}

export default Profile;