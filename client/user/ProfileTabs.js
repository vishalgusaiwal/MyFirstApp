import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FollowGrid from './../user/FollowGrid';
import PostList from './../post/PostList';
import Box from "@material-ui/core/Box"


const TabContainer = (props) => {
    return (
        <Typography component="div" style={{ padding: 8 * 2 }}>
            {props.children}
        </Typography>
    )
}
TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}
export default function ProfileTabs(props) {
    const [tab, setTab] = useState(0);
    const handleTabChange = (event, value) => {
        setTab(value);
    }
    return (
        <Box sx={{width:"100%"} }>
            <AppBar position="static" color="default">
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Posts" />
                    <Tab label="Following" />
                    <Tab label="Followers" />
                </Tabs>
            </AppBar>
            {tab === 0 && <Box width="50%" style={{margin:"auto"}}><TabContainer><PostList removeUpdate={props.removePostUpdate} posts={props.posts} /></TabContainer></Box>}
            {tab === 1 && <TabContainer><FollowGrid people={props.user.following} /></TabContainer>}
            {tab === 2 && <TabContainer><FollowGrid people={props.user.followers} /></TabContainer>}
        </Box>
    )
}
ProfileTabs.propTypes = {
    user: PropTypes.object.isRequired,
    removePostUpdate: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired
}