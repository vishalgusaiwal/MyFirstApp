import React from "react";
import Post from "./Post";
import PropTypes from 'prop-types';
import NoRecordsMessage from "./NoRecordFound";

export default function PostList(props) {
    const posts = Array.from(props.posts);
    return (
        <div style={{ marginTop: '24px', width:"100%" }}>
            {
                posts.length>0 ? posts.map((item, i) => {
                    return <Post post={item} key={i}
                        onRemove={props.removeUpdate} />
                }) : <NoRecordsMessage />
            }
        </div>
    );
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}