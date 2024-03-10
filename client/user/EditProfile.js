import * as auth from './../auth/auth-helper';
import { update, read } from './api-user';
import { Link, redirect, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as Mui from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Avatar from '@material-ui/core/Avatar'
import FileUpload from '@material-ui/icons/AddPhotoAlternate'

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
const EditProfile = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        about: '',
        photo:'',
        error: '',
        redirectToProfile: false
    });
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const classes = useStyles();
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = auth.isAuthenticated();
        read({
            userId: params.userId
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
                //setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, name: data.profile.name, email: data.profile.email });
            }
        });
        return () => {
            abortController.abort();
        }
    }, [params.userId]);
    const clickSubmit = () => {
        const jwt = auth.isAuthenticated();
        let userData = new FormData();
        values.name && userData.append('name',values.name);
        values.email && userData.append('email', values.email);
        values.password && userData.append('password', values.password);
        values.about && userData.append('about', values.about);
        values.photo && userData.append('photo', values.photo);
        /*const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            about: values.about || undefined
        }*/
        update({
            userId:params.userId
        }, {
            t: jwt.token
        }, userData).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, userId: data._id, redirectToProfile: true })
            }
        })
    }

    if (values.redirectToProfile) navigate('/user/' + params.userId);

    if (redirectToSignin) navigate('/signin');

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        setValues({ ...values, [name]: value });
    }
    return (
        <div>
            <Mui.Card className={classes.card} style={{ display: 'flex', justifyContent: 'center' }}>
                <Mui.CardContent>
                    <Mui.Typography variant="h6" className={classes.title}>
                        Edit Profile
                    </Mui.Typography>
                    <br />
                    {/*<Avatar src={photoUrl} className={classes.bigAvatar} /><br />*/}
                    <input accept="image/*" onChange={handleChange('photo')} className={classes.input} id="icon-button-file" type="file" style={{ display: 'none' }} />
                    <label htmlFor="icon-button-file">
                        <Mui.Button variant="contained" color="default" component="span">
                            Upload
                            <FileUpload />
                        </Mui.Button>
                    </label> <span className={classes.filename}>{values.photo ? values.photo.name : ''}</span>
                    <br />
                    <Mui.TextField id="name" lable="Name"
                        className={classes.textField}
                        value={values.name} onChange={handleChange('name')}
                        margin="normal"
                        style={{ width:'300px'}}
                    />
                    <br />
                    <Mui.TextField id="multiline-flexible" label="About"
                        multiline rows="2"
                        value={values.about}
                        onChange={handleChange('about')}
                        style={{ width: '300px' }}
                    />
                    <br />
                    <Mui.TextField id="email" lable="Email"
                        className={classes.textField}
                        value={values.email} onChange={handleChange('email')}
                        margin="normal"
                        style={{ width: '300px' }}
                    />
                    <br />
                    <Mui.TextField id="password" lable="Password"
                        className={classes.textField}
                        value={values.password} onChange={handleChange('password')}
                        margin="normal"
                        style={{ width: '300px' }}
                    />
                    <br />
                    {
                        values.error && (<Mui.Typography component="p" color="error">
                            <Mui.Icon color="error"
                                className={classes.error}>Error</Mui.Icon>
                            {values.error}
                        </Mui.Typography>)
                    }
                    <br />
                    <Mui.Box width="300px" style={{ justifyContent:'center' }}>
                        <Mui.Button color="primary" variant="contained"
                            onClick={clickSubmit}
                            className={classes.submit}>Submit</Mui.Button>
                    </Mui.Box>
                </Mui.CardContent>
            </Mui.Card>
            <Mui.Dialog open={values.open} disableBackdropClick={true}>
                <Mui.DialogTitle>New Account</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.DialogContentText>
                        Profile updated successfully.
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
    );
}

export default EditProfile;