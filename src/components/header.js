import React, {useState} from 'react';
import styles from '../styles/header.module.css';
import { House, Search } from 'lucide-react';
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
        dispatch(fetchSearchedPosts({token: localStorage.getItem('redditToken'), query: searchTerm}));
        // Clear the search term
        setSearchTerm('');
        navigate(`/reddit-client/search/${searchTerm}`);
    }

    return (
        <header>
            <Link to='/reddit-client/' className={styles.link}><h1>Reddit</h1><p className={styles.mini}>mini</p></Link> {/* Logo and link to home */}
            <Link to='/reddit-client/' className={styles.houseLink}><House className={styles.houseIcon} size={25} color='black'/></Link>
            <form className={styles.search} onSubmit={handleSearchSubmit}>
                <Search className={styles.searchIcon} size={25} color="black" />
                <input className={styles.input} type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </form>
        </header>
    )
}