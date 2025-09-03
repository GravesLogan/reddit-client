import './App.css';

import { BrowserRouter as Router, Routes, Route, Link, NavLink, useParams } from "react-router-dom";

import Header from './components/header';
import Post from './components/post';
import PostComments from './components/postComments';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchSearchedPosts } from "./slices/postsSlice";


// Get the reddit API token
async function getRedditToken() {
  const clientId = "NqtOdB1n_MoSSSyTUbZjRA";
  const clientSecret = "75bcxuEVQGCTDtCBCxIZGGc4J1sVUQ";

  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  return data.access_token; // use this in API calls
}
sessionStorage.setItem('redditToken', await getRedditToken());




function DisplayPosts() {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);
  const { searchTerm } = useParams();

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchSearchedPosts({token: sessionStorage.getItem('redditToken'), query: searchTerm}));
    } else {
      dispatch(fetchPosts(sessionStorage.getItem('redditToken')));
    }
  }, [searchTerm, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} viewComments={false}/>
      ))}
    </ul>
  );
}


function App() {
  return (
    <div>
      <Router>
        <Header/>
        <Routes>
          {/* Main landing page, displays popular posts */}
          <Route path="/" element={
            <div className='non-header'>
              <DisplayPosts />
            </div>
          }/>

          {/* Displays searched posts */}
          <Route path="/search/:searchTerm" element={
            <div className='non-header'>
              <DisplayPosts />
            </div>
          }/>

          {/* Displays selected post and its comments */}
          <Route path="/post/:postID" element={
            <div className='non-header'>
              <PostComments />
            </div>
          }/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
