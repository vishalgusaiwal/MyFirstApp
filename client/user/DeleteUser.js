import * as auth from './../auth/auth-helper';
import * as Apis from './api-user';
import { useNavigate } from "react-router-dom";
import * as Mui from '@material-ui/core';
import { useEffect, useState } from "react";
import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
const DeleteUser = (props) => {
    const [open, setOpen] = useState(false);
    const [redirected, setRedirected] = useState(false);
    const navigate = useNavigate();
    const clickButton = () => {
        setOpen(true);
    }
    const handleRequestClose = () => {
        setOpen(false);
    }
    const deleteAccount = () => {
        const jwt = auth.isAuthenticated();
        Apis.remove({
            userId: props.userId
        }, { t: jwt.token }).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                auth.clearJWT(() => {
                    console.log('deleted');
                    setRedirected(true);
                })
            }
        });
    }
    if (redirected) navigate("/");// redirect("/");

    return (
        <span>
            <Mui.IconButton area-label="Delete"
                onClick={clickButton} color="secondary">
                <DeleteIcon />
            </Mui.IconButton>

            <Mui.Dialog open={open} onClose={handleRequestClose}>
                <Mui.DialogTitle>{"Delete Account"}</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.DialogContentText>
                        Confirm to delete Your Account.
                    </Mui.DialogContentText>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={deleteAccount}
                        color="secondary" autoFocus="autoFocus">
                        Confirm
                    </Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>
        </span>
    );
}

/*DeleteUser.propTypes = {
    userId: propTypes.string.isRequired
};*/
export default DeleteUser;