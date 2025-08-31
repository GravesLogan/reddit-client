import './App.css';

import Header from './components/header';
import Post from './components/post';

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




function PopularPosts() {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (status === "idle") { // only fetch posts if we haven't already
      dispatch(fetchPosts(sessionStorage.getItem('redditToken')));
    }
  }, [status, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}


function App() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  function handleSearchChange(term) {
    setSearchTerm(term);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();

    // This will update the posts in the store with the searched posts
    dispatch(fetchSearchedPosts({token: sessionStorage.getItem('redditToken'), query: searchTerm}));

    setSearchTerm('');
  }


  return (
    <div>
      <Header handleSearchChange={handleSearchChange} handleSearchSubmit={handleSearchSubmit} searchTerm={searchTerm}/>
      <div className='non-header'>
        <PopularPosts />
      </div>
    </div>
  );
}

export default App;
