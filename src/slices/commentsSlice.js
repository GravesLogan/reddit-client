import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Recursive function to grab just the data we care about from comments and replies
const getNestedData = (replies) => {
    if (!replies) {
        return "";
    } else {
        return (replies.data.children.filter(comment => comment.data.author !== undefined).map(comment => {
            return {
                commentId: comment.data.id,
                commentAuthor: comment.data.author,
                commentTime: comment.data.created_utc,
                commentBody: comment.data.body_html,
                commentReplies: getNestedData(comment.data.replies),
            }
        }))
    }
}


export const fetchPostsComments = createAsyncThunk('posts/fetchPostsComments', async({token, postId}) => {
    const response = await fetch(`https://oauth.reddit.com/comments/${postId}`, {
        headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "RedditClient/0.1 by /u/HyperNovaaa22"
        }
    });
    const data = await response.json();
    let postData = data[0].data.children[0].data;
    let returnObj = {
        post: {
            id: postData.id,
            author: postData.author,
            title: postData.title,
            upvotes: postData.ups,
            created: postData.created_utc,
            numComments: postData.num_comments,
            postType: postData.post_hint,
            text: postData.selftext,
            
        }, // returns the object containing the post data
        comments: data[1].data.children.map((comment) => {
            return {
                commentId: comment.data.id,
                commentAuthor: comment.data.author,
                commentTime: comment.data.created_utc,
                commentBody: comment.data.body_html,
                commentReplies: getNestedData(comment.data.replies),
            }
        }) // returns and array of comments with the data needed
    }


    if (returnObj.post.postType === 'image' || returnObj.post.postType === 'link') {
        returnObj.post.image = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
        returnObj.post.width = postData.preview.images[0].source.width;
        returnObj.post.height = postData.preview.images[0].source.height;
    } else if (returnObj.post.postType === 'hosted:video') {
        returnObj.post.video = postData.media.reddit_video.hls_url;
        returnObj.post.width = postData.media.reddit_video.width;
        returnObj.post.height = postData.media.reddit_video.height;
    } else if (returnObj.post.postType === 'rich:video') {
        // ignore for now
    }

    if (postData.gallery_data) {
        returnObj.post.images = postData.gallery_data.items.map(item => {
            return postData.media_metadata[item.media_id].p[3].u.replace(/&amp;/g, '&');
        })
    }

    return returnObj
});

// Want it to return an object with comment's author, time, message, and replies if any.
/*
const getCommentsReplies = (level, comment) => {
    if (!comment.replies) {
        return ({
            level,
            author: comment.author,
            time: comment.created_utc,
            bodyHtml: comment.body_html,
        })
    }
}
*/

const commentsSlice = createSlice({
    name: 'commentsSlice',
    initialState: {
        post: {},
        comments: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPostsComments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // new
                state.post = action.payload.post;
                state.comments = action.payload.comments;
            })
            .addCase(fetchPostsComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

export default commentsSlice.reducer;