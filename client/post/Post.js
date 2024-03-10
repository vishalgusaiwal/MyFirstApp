import { Link } from "react-router-dom";
import { Avatar, IconButton, Card, CardActions, CardContent, Typography, CardHeader, Box } from "@material-ui/core";
import { isAuthenticated } from "../auth/auth-helper";
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import { useState } from "react";
import React from "react";
import { like, unlike, remove } from "./api-post";
import Comments from "./Comments";
import Divider from '@material-ui/core/Divider';



const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 400, // Adjust the maximum width of the card
        margin: 'auto',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        padding: `${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(1)}px`,
        color: theme.palette.openTitle,
        fontSize: '1.2rem', // Adjust the font size of the title
    },
    media: {
        width: '100%',
        height: 'auto',
        maxHeight: 500,
        objectFit:'cover'
    },
    text: {
        fontSize: '1rem', // Adjust the font size of the text
        marginBottom: theme.spacing(1),
    },
    button: {
        padding: 4,
    },
}));
export default function Post(props) {
    const classes = useStyles();
    const jwt = isAuthenticated();
    const [view, setView] = useState(false);
    const checkLike = (likes) => {
        let match = likes && likes.indexOf(jwt.user._id) !== -1;
        return match;
    }
    const [values,setValues] = useState({
        like: checkLike(props.post.likes),
        likes: props.post.likes.length,
        comments:props.post.comments
    });
    const handleCommentView = () => {
        setView(!view);
    }
    const deletePost = () => {
        remove({
            postId: props.post._id
        }, {
            t: jwt.token
        }).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                props.onRemove(props.post);
            }
        });
    }
    const clickLike = () => {
        let callApi = values.like ? unlike : like;
        callApi({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, props.post._id).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, like: !values.like, likes: data.likes.length });
            }
        });
    }
    const updateComments = (comments) => {
        setValues({ ...values, comments: comments });
    }
    return (
        <Box sx={{ margin: "auto" }}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar src={'/api/users/photo/' + props.post.postedBy._id} />
                    }
                    action={props.post.postedBy._id === isAuthenticated().user._id &&
                        <IconButton onClick={deletePost}>
                            <DeleteIcon />
                        </IconButton>
                    }
                    title={<Link to={"/user/" + props.post.postedBy._id} style={{ textDecoration:'none' }}>{props.post.postedBy.name}</Link>}
                    subheader={(new Date(props.post.created)).toDateString()}
                    classNmae={classes.cardHeader}
                />
                <CardContent classNmae={classes.cardContent}>
                    <Typography component="p" className={classes.text}>
                        {props.post.text}
                    </Typography>
                    {
                        props.post.photo &&
                        (<div className={classes.photo}>
                            <img className={classes.media}
                                src={'/api/posts/photo/' + props.post._id} />
                        </div>)
                    }
                </CardContent>
                <CardActions>
                    {
                        values.like
                            ? <IconButton onClick={clickLike} className={classes.button}
                                area-label="Like" color="secondary">
                                <FavoriteIcon />
                            </IconButton>
                            : <IconButton onClick={clickLike} className={classes.button}
                                area-label="Unlike" color="secondary">
                                <FavoriteBorderIcon />
                            </IconButton>
                    }
                    <span>{values.likes}</span>
                    <IconButton className={classes.button}
                        area-label="Comment" color="secondary">
                        <CommentIcon onClick={handleCommentView} />
                    </IconButton>
                    <span>{values.comments.length}</span>
                </CardActions>
                <Divider />
                {
                    view && <Comments postId={props.post._id} comments={values.comments} updateComments={updateComments} />
                }
            </Card>
        </Box>
    )
}