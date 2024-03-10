import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './core/Home';
import Signup from './user/Signup';
import Users from './user/Users';
import Signin from './auth/Signin';
import Profile from './user/Profile';
import EditProfile from './user/EditProfile';
import PrivateRoute from './auth/PrivateRoute';
import Menu from './core/Menu';

const MainRouter = () => {
    return (
        <div>
            <Menu />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/user/:userId" element={<Profile />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/user/edit/:userId" element={<EditProfile/> }/>
                </Route>
            </Routes>
        </div>
    );
}

export default MainRouter;