import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import unicornbikeImg from './../assets/images/unicornbike.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/auth-helper';
import Grid from '@material-ui/core/Grid';
import FindPeople from '../user/FindPeople';
import Newsfeed from '../post/Newsfeed';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 800,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 300
    }
}));

export default function Home() {
    const classes = useStyles();
    const [defaultPage, setDefaultPage] = useState(false);
    useEffect(() => {
        if (isAuthenticated()) setDefaultPage(true);
        else setDefaultPage(false);
    }, []);
    return (
        <div>
            <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                    Welcome to my Social Media Application
                </Typography>
                {
                    !defaultPage &&
                    <div>
                        <CardMedia className={classes.media} image={unicornbikeImg} title="Unicorn Bicycle" />
                        <CardContent>
                            <Typography variant="body2" component="p">
                                Welocme to Mern Project Home page
                            </Typography>
                        </CardContent>
                    </div>
                }
                {
                    defaultPage &&
                        <Grid container spacing={2}>
                            <Grid item xs={7} sm={6}>
                                <Newsfeed />
                            </Grid>
                            <Grid item xs={7} sm={6}>
                                <FindPeople />
                            </Grid>
                        </Grid>
                }
            </Card>
        </div>
    );
}