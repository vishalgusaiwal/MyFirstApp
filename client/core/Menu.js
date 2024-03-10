import React from "react";
import * as Mui from '@material-ui/core';
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import * as auth from './../auth/auth-helper';
import HomeIcon from '@material-ui/icons/Home';
import { useLocation } from 'react-router-dom';

const isActive = (location, path) => {
    if (location.pathname === path) return { color: '#ff4081' };
    else return { color: '#ffffff' };
}

const Menu = () => {
    const navigate = useNavigate(); // Use useNavigate to get the navigation function
    const location = useLocation();
    return (
        <Mui.AppBar position="static">
            <Mui.Toolbar>
                <Mui.Typography variant="h6" color="inherit">
                    Social Media Application
                </Mui.Typography>
                <Link to="/">
                    <Mui.IconButton aria-label="Home" style={isActive(location, "/")}>
                        <HomeIcon />
                    </Mui.IconButton>
                </Link>
                <Link to="/users">
                    <Mui.Button style={isActive(location, "/users")}>Users</Mui.Button>
                </Link>
                {
                    !auth.isAuthenticated() && (
                        <span>
                            <Link to="/signup">
                                <Mui.Button style={isActive(location, "/signup")}>Sign up</Mui.Button>
                            </Link>
                            <Link to="/signin">
                                <Mui.Button style={isActive(location, "/signin")}>Sign in</Mui.Button>
                            </Link>
                        </span>
                    )
                }
                {
                    auth.isAuthenticated() && (
                        <span>
                            <Link to={"/user/" + auth.isAuthenticated().user._id}>
                                <Mui.Button style={isActive(location, "/user/" + auth.isAuthenticated().user._id)}>
                                    My profile
                                </Mui.Button>
                            </Link>
                            <Mui.Button color="inherit"
                                onClick={() => { auth.clearJWT(() => navigate('/signin')) }}>
                                Sign out
                            </Mui.Button>
                        </span>
                    )
                }
            </Mui.Toolbar>
        </Mui.AppBar>
    );
};

export default Menu;
