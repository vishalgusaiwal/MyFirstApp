import * as auth from './api-user';
import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import unicornbikeImg from './../assets/images/unicornbike.jpg';
import { Link } from 'react-router-dom';
import * as Mui from '@material-ui/core';

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
export default function Signup() {
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        about:'',
        open: false,
        error: ''
    });
    const classes = useStyles();
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }
    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            about: values.about || 'something'
        }
        auth.create(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', open: true });
            }
        });
    }

    return (
        <div>
            <Mui.Card className={classes.card}>
                <Mui.CardContent>
                    <Mui.Typography variant="h6" className={classes.title}>
                        Sign up
                    </Mui.Typography>
                    <Mui.TextField id="name" lable="Name"
                        className={classes.textField}
                        value={values.name} onChange={handleChange('name')}
                        margin="normal"
                    />
                    <br />
                    <Mui.TextField id="email" lable="Email"
                        className={classes.textField}
                        value={values.email} onChange={handleChange('email')}
                        margin="normal"
                    />
                    <br />
                    <Mui.TextField id="password" lable="Password"
                        className={classes.textField}
                        value={values.password} onChange={handleChange('password')}
                        margin="normal"
                    />
                    <br />
                    {
                        values.error && (<Mui.Typography component="p" color="error">
                            <Mui.Icon color="error"
                                className={classes.error}>Error</Mui.Icon>
                            {values.error}
                        </Mui.Typography>)
                    }
                </Mui.CardContent>
                <Mui.CardActions>
                    <Mui.Button color="primary" variant="contained"
                        onClick={clickSubmit}
                        className={classes.submit}>Submit</Mui.Button>
                </Mui.CardActions>
            </Mui.Card>
            <Mui.Dialog open={values.open} disableBackdropClick={true}>
                <Mui.DialogTitle>New Account</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.DialogContentText>
                        New account created successfully.
                    </Mui.DialogContentText>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Link to="/signin">
                        <Mui.Button color="primary" autoFocus="autoFocus"
                            variant="contained">
                            Sign in
                        </Mui.Button>
                    </Link>
                </Mui.DialogActions>
            </Mui.Dialog>
        </div>
    )
}