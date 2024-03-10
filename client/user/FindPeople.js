import { useEffect, useState } from "react";
import { isAuthenticated } from "../auth/auth-helper";
import { findPeople, follow } from "./api-user";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import ViewIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';



const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
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
export default function FindPeople() {
    const [values, setValues] = useState({
        users: [],
        open: false,
        followMessage: ''
    });
    const classes = useStyles();
    const clickFollow = (user, index) => {
        const jwt = isAuthenticated();
        follow({
            userId: jwt.user._id
        }, {
            t:jwt.token
        }, user._id).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                let toFollow = values.users;
                toFollow.splice(index, 1);
                setValues({ ...values, users: toFollow, open: true, followMessage: `Following ${user.name}!` });
            }
        })
    }
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = isAuthenticated();
        findPeople({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, signal).then((data) => {
            if (data && data.error) {
                setValues({ ...values, users: data });
            } else {
                setValues({ ...values, users: data });
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, []);

    const handleRequestClose = (event, reason) => {
        setValues({ ...values, open: false })
    }

    return (
        <div style={{ width:'100%'}}>
            <Paper sx={{ width: '75%', padding: '16px' }}>
                <Typography type="title" className={classes.title}>
                    Who to follow
                </Typography>
                <List sx={{ width: '100%' }}>
                    {
                        values.users.map((item, i) => {
                            return <span key={i}>
                                <ListItem sx={{ width: '100%' }}>
                                    <ListItemAvatar className={classes.avatar}>
                                        <Avatar src={'/api/users/photo/' + item._id} />
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} />
                                    <ListItemSecondaryAction className={classes.follow}>
                                        <Link to={'/user/' + item._id}>
                                            <IconButton variant="contained" color="secondary" className={classes.viewButton}>
                                                <ViewIcon />
                                            </IconButton>
                                        </Link>
                                        <Button aria-label="Follow" variant="contained"
                                            color="primary"
                                            onClick={() => { clickFollow(item, i) }}>
                                            Follow
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </span>
                        })
                    }
                </List>
            </Paper>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                open={values.open}
                onClose={handleRequestClose}
                autoHideDuration={6000}
                message={<span
                    className={classes.snack}>{values.followMessage}</span>}
            />
        </div>
    )
}