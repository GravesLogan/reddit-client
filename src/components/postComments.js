import React from 'react';
import styles from '../styles/postComments.module.css'; 
import { useDispatch, useSelector } from 'react-redux';

import Post from './post';



export default function PostComments() {
    const { post, comments, status, error } = useSelector((state) => state.comments);

    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Error: {error}</p>;

    return (
        <Post post={post} />
    );
}