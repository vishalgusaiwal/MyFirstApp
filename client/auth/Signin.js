import { useState } from 'react';
import { Link, redirect, useHistory , useNavigate } from "react-router-dom";
import { signin } from './api-auth';
import * as auth from './auth-helper';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
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
const Signin = (props) => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToReferrer: false
    });
    const classes = useStyles();
    const navigate = useNavigate();
    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined
        }
        signin(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                auth.authenticate(data, () => {
                    setValues({ ...values, error: '', redirectToReferrer: true });
                });
            }
        });
    }
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }
    const { from } = props.location || { from: { pathname: "/" } };
    const { redirectToReferrer } = values;

    if (redirectToReferrer) navigate(from);// redirect(from);
    
    return (
        <div>
            <Mui.Card className={classes.card}>
                <Mui.CardContent>
                    <Mui.Typography variant="h6" className={classes.title}>
                        Sign in
                    </Mui.Typography>
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
        </div>
    )
}

export default Signin;