import React, {useState} from 'react';
import styles from '../styles/header.module.css';
import { Search } from 'lucide-react';



export default function Header(props) {

    const {handleSearchChange, handleSearchSubmit, searchTerm} = props;

    return (
        <header>
            <div className={styles.logo}>
                <h1>Reddit</h1><p className={styles.mini}>mini</p>
            </div>
            <form className={styles.search} onSubmit={handleSearchSubmit}>
                <Search className={styles.searchIcon} size={25} color="black" />
                <input className={styles.input} type="text" placeholder="Search" value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} />
            </form>
        </header>
    )
}