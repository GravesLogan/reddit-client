import React from 'react';
import styles from '../styles/postComments.module.css'; 
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from "dompurify"; 

import Post from './post';


function CommentBody({ textHtml }) {
  // First decode the HTML entities
  const parser = new DOMParser();
  const decoded = parser.parseFromString(textHtml, "text/html").body.textContent;

  // Sanitize before injecting
  const cleanHtml = DOMPurify.sanitize(decoded);

  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  );
}


export default function PostComments() {
    const { post, comments, status, error } = useSelector((state) => state.comments);

    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Error: {error}</p>;

    return (
        <div>
            <Post post={post} />
            <ul className={styles.commentsContainer}>
                {comments.map(comment => {
                    return(
                        <li key={comment.commentId} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <div className={styles.author}>{comment.commentAuthor}</div>
                                <div className={styles.date}>{new Date(comment.commentTime * 1000).toLocaleDateString()}</div>
                            </div>
                            <CommentBody className={styles.text} textHtml={comment.commentBody} />
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}