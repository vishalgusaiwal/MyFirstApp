import { isAuthenticated } from "../auth/auth-helper";
import { create } from "./api-post";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, Avatar, Button, CardActions, CardContent, Icon, IconButton, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { PhotoCamera } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#efefef',
        padding: `${theme.spacing(3)}px 0px 1px`
    },
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(65, 150, 136, 0.09)',
        boxShadow: 'none'
    },
    cardContent: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0
    },
    cardHeader: {
        paddingTop: 8,
        paddingBottom: 8
    },
    photoButton: {
        height: 30,
        marginBottom: 5
    },
    input: {
        display: 'none',
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '90%'
    },
    submit: {
        margin: theme.spacing(2)
    },
    filename: {
        verticalAlign: 'super'
    }
}));
export default function NewPost(props) {
    const classes = useStyles();
    const jwt = isAuthenticated();
    const [values, setValues] = useState({
        text: '',
        photo: '',
        error: '',
        user: {}
    });
    useEffect(() => {
        setValues({ ...values, user: isAuthenticated().user });
    }, []);
    const clickPost = () => {
        let postData = new FormData();
        postData.append('text', values.text);
        postData.append('photo', values.photo);
        create({
            userId: jwt.user._id
        }, {
            t: jwt.token
        }, postData).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, text: '', photo: '' });
                props.addUpdate(data);
            }
        });
    }
    const handleChange = name=> event => {
        const value = name === 'photo'
            ? event.target.files[0]
            : event.target.value;
        setValues({ ...values, [name]: value });
    }
    const photoUrl = values.user._id ? '/api/users/photo/' + values.user._id : '/api/user/defaultphoto';
    return (
        <div className={classes.root}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar src={photoUrl} />
                    }
                    title={values.user.name}
                    className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                    <TextField
                        placeholder="Share your thoughts ..."
                        multiline
                        value={values.text}
                        rows="3"
                        onChange={handleChange('text')}
                        className={classes.textField}
                        margin="normal"
                    />
                    <input accept="image/*" onChange={handleChange('photo')} className={classes.input} id="icon-button-file" type="file" />
                    <label htmlFor="icon-button-file">
                        <IconButton color="secondary" className={classes.photoButton} component="span">
                            <PhotoCamera/>
                        </IconButton>
                    </label>
                    <label><span className={classes.filename}>{values.photo ? values.photo.name : ''}</span></label>
                    {
                        values.error && (
                            <Typography color="error" component="p">
                                <Icon color="error" className={classes.error}>error</Icon>
                                {values.error}
                            </Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" disabled={values.text === ''} onClick={clickPost} className={classes.submit}>POST</Button>
                </CardActions>
            </Card>
        </div>
    );
}