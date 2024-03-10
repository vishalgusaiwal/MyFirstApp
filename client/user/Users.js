import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import * as Mui from '@material-ui/core';
import * as Apis from './api-user';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Person from '@material-ui/icons/Person';
import ArrowForward from '@material-ui/icons/ArrowForward';
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
export default function Users() {
    const [users, setUsers] = useState([]);
    const classes = useStyles();
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        Apis.list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(JSON.parse(data.user));
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, []);

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                All users
            </Typography>
            <Mui.List dense>
                {users && users.map((item, i) => {
                    return (
                        <Link to={"/user/" + item._id} key={i} style={{ textDecoration: 'none', color: 'black' }}>
                            <Mui.ListItem button>
                                <Mui.ListItemAvatar>
                                    <Mui.Avatar src={`/api/users/photo/${item._id}?${new Date().getTime}`}>
                                        <Person />
                                    </Mui.Avatar>
                                </Mui.ListItemAvatar>
                                <Mui.ListItemText primary={item.name} />
                                <Mui.ListItemSecondaryAction>
                                    <Mui.IconButton>
                                        <ArrowForward />
                                    </Mui.IconButton>
                                </Mui.ListItemSecondaryAction>
                            </Mui.ListItem>
                        </Link>
                    )
                })}
            </Mui.List>
        </Paper>
    );
}