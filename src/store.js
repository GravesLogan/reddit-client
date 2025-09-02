import {configureStore} from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import commentReducer from './slices/commentsSlice';

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        comments: commentReducer,
    },
});