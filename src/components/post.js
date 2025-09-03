import React, { useEffect, useRef } from 'react';
import styles from '../styles/post.module.css';
import Hls from "hls.js";
import DOMPurify from "dompurify"; 

import Gallery from './imageGallery';

import {fetchPostsComments} from '../slices/commentsSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

/* Here is what the post data will look like
    - author = data.children[n].data.author
    - title = data.children[n].data.title
    - upvotes = data.children[n].data.ups
    - created = data.children[n].data.created_utc
    - id = data.children[n].data.id
    - numComments = data.children[n].data.num_comments
    - postType = data.children[n].data.post_hint
    - text = data.children[n].data.selftext

    if postType === 'image' or 'link'
        image = data.children[n].data.preview.images[0].source.url
        width = data.children[n].data.preview.images[0].source.width
        height = data.children[n].data.preview.images[0].source.height


    if postType === 'hosted:video'
        video = data.children[n].data.media.reddit_video.hsl_url
        height = data.children[n].data.media.reddit_video.height
        width = data.children[n].data.media.reddit_video.width

    if postType === 'rich:video' ignore for now
*/

function PostBody({ textHtml }) {
  // First decode the HTML entities
  const parser = new DOMParser();
  const decoded = parser.parseFromString(textHtml, "text/html").body.textContent;

  // Sanitize before injecting
  const cleanHtml = DOMPurify.sanitize(decoded);

  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  );
}

function HlsPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = src;
      }
    }
  }, [src]);

  return (
    <div className={styles.videoContainer}>
        <video ref={videoRef} controls className="video-player" />
    </div>
);
}

export default function Post(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {post} = props;
    return (
        <div className={styles.post}>
            <div className={styles.left}>
                <div className={styles.rating}>
                    <ChevronUp className={styles.statsIcons} color='black'/>
                    <p className={styles.statsNums}>{post.upvotes}</p>
                    <ChevronDown className={styles.statsIcons} color='black'/>
                </div>
                <div className={styles.comments} onClick={() => {
                    dispatch(fetchPostsComments({token: sessionStorage.getItem('redditToken'), postId: post.id}))
                    navigate(`/post/${post.id}`);
                  }}>
                    <MessageCircle className={styles.statsIcons} color='black'/>
                    <p className={styles.statsNums}>{post.numComments}</p>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.content}>
                    <h2 className={styles.title}onClick={() => {
                      dispatch(fetchPostsComments({token: sessionStorage.getItem('redditToken'), postId: post.id}))
                      navigate(`/post/${post.id}`);
                  }}>{post.title}</h2>
                    <p>{props.text}</p>
                    <div className={styles.imageContainer}>
                        {(post.postType === 'image' || post.postType === 'link') && <img className={styles.image} src={post.image} alt="Post visual content" />}
                        {post.postType === 'hosted:video' && <HlsPlayer src={post.video} />}
                        {post.images && <Gallery images={post.images}/>}
                    </div>
                    <PostBody textHtml={post.text} />
                </div>
                <div className={styles.footer}>
                    <p>Posted by <span className={styles.author}>{post.author}</span></p>
                    <p>{new Date(post.created * 1000).toLocaleDateString()}</p>
                </div>
            </div>   
        </div>
    )            
}