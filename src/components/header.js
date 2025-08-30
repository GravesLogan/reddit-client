import React from 'react';
import styles from '../styles/header.module.css';

import { House, Search } from 'lucide-react';

export default function Header() {
    return (
        <header>
            <div className={styles.logo}>
                <h1>Reddit</h1><p>mini</p>
            </div>
            <div className={styles.search}>
                <Search className={styles.searchIcon} size={25} color="black" />
                <input className={styles.input} type="text" placeholder="Search" />
            </div>
        </header>
    )
}