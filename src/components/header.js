import React, {useState} from 'react';
import styles from '../styles/header.module.css';
import { Search } from 'lucide-react';
import { useDispatch } from "react-redux";
import { fetchSearchedPosts } from "../slices/postsSlice";
import { Link, useNavigate } from 'react-router-dom';



export default function Header() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    function handleSearchSubmit(e) {
        e.preventDefault();
        // This will update the posts in the store with the searched posts
        dispatch(fetchSearchedPosts({token: sessionStorage.getItem('redditToken'), query: searchTerm}));
        // Clear the search term
        setSearchTerm('');
        navigate(`/search/${searchTerm}`);
    }

    return (
        <header>
            <Link to='/' className={styles.link}><h1>Reddit</h1><p className={styles.mini}>mini</p></Link> {/* Logo and link to home */}
            <form className={styles.search} onSubmit={handleSearchSubmit}>
                <Search className={styles.searchIcon} size={25} color="black" />
                <input className={styles.input} type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </form>
        </header>
    )
}