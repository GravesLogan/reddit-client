import {createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Async thunk to fetch popular posts from Reddit
export const fetchPosts = createAsyncThunk('posts/fetchPopular', async(token) => {
    const response = await fetch("https://oauth.reddit.com/r/popular", {
        headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "RedditClient/0.1 by /u/HyperNovaaa22"
        }
    });
    const data = await response.json();
    return data.data.children.map((child) => child.data);
});

// Async thunk to fetch searched posts from Reddit
export const fetchSearchedPosts = createAsyncThunk('posts/fetchSearched', async({token, query}) => {
    const response = await fetch(`https://oauth.reddit.com/search?q=${encodeURIComponent(query)}`, {
        headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "RedditClient/0.1 by /u/HyperNovaaa22"
        }
    });
    const data = await response.json();
    return data.data.children.map((child) => child.data);
});


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


const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {
        likePost: (state, action) => {
            // like post logic
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.map(post => {
                    const postData = {
                        id: post.id,
                        author: post.author,
                        title: post.title,
                        upvotes: post.ups,
                        created: post.created_utc,
                        numComments: post.num_comments,
                        postType: post.post_hint,
                        text: post.selftext,
                    }

                    if (postData.postType === 'image' || postData.postType === 'link') {
                        postData.image = post.preview.images[0].source.url.replace(/&amp;/g, '&');
                        postData.width = post.preview.images[0].source.width;
                        postData.height = post.preview.images[0].source.height;
                    } else if (postData.postType === 'hosted:video') {
                        postData.video = post.media.reddit_video.hls_url;
                        postData.width = post.media.reddit_video.width;
                        postData.height = post.media.reddit_video.height;
                    } else if (postData.postType === 'rich:video') {
                        // ignore for now
                    }

                    if (post.gallery_data) {
                        postData.images = post.gallery_data.items.map(item => {
                            return post.media_metadata[item.media_id].p[3].u.replace(/&amp;/g, '&');
                        })
                    }

                    return(postData);
                })
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchSearchedPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSearchedPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.map(post => {
                    const postData = {
                        id: post.id,
                        author: post.author,
                        title: post.title,
                        upvotes: post.ups,
                        created: post.created_utc,
                        numComments: post.num_comments,
                        postType: post.post_hint,
                        text: post.selftext,
                    }

                    if (postData.postType === 'image' || postData.postType === 'link') {
                        postData.image = post.preview.images[0].source.url.replace(/&amp;/g, '&');
                        postData.width = post.preview.images[0].source.width;
                        postData.height = post.preview.images[0].source.height;
                    } else if (postData.postType === 'hosted:video') {
                        postData.video = post.media.reddit_video.hls_url;
                        postData.width = post.media.reddit_video.width;
                        postData.height = post.media.reddit_video.height;
                    } else if (postData.postType === 'rich:video') {
                        // ignore for now
                    }

                    if (post.gallery_data) {
                        postData.images = post.gallery_data.items.map(item => {
                            return post.media_metadata[item.media_id].p[2].u.replace(/&amp;/g, '&');
                        })
                    }
                    return(postData);
                })
            })
            .addCase(fetchSearchedPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { likePost } = postsSlice.actions;
export default postsSlice.reducer;