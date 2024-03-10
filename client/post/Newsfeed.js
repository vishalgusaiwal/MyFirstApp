import { useEffect, useState } from "react";
import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import {listNewsFeed} from "./api-post"
import { isAuthenticated } from '../auth/auth-helper';
import NewPost from "./NewPost";
import PostList from "./PostList";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    card: {
        margin: 'auto',
        paddingTop: 0,
        paddingBottom: theme.spacing(3)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle,
        fontSize: '1em'
    },
    media: {
        minHeight: 330
    }
}));
export default function Newsfeed() {
    const [posts, setPosts] = useState({});
    const classes = useStyles();
    const jwt = isAuthenticated();
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        listNewsFeed({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, signal).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setPosts(data);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, []);
    const addPost = (post) => {
        const updatePost = [...posts];
        updatePost.unshift(post);
        setPosts(updatePost);
    }

    const removePost = (post) => {
        const updatePosts = [...posts];
        const index = updatePosts.indexOf(post);
        updatePosts.splice(index, 1);
        setPosts(updatePosts);
    }
    return (
        <Card className={classes.card}>
            <Typography type="title" className={classes.title}> Newsfeed </Typography>
            <Divider />
            <NewPost addUpdate={addPost} />
            <Divider />
            <PostList removeUpdate={removePost} posts={posts}/>
        </Card>
    )
}