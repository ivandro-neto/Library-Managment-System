import React, { useState } from 'react';
import styles from './css/styles.module.css'; // CSS file for styling

interface SearchBarProps {
  onSearch: (query: string) => void; // Callback for handling search queries
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className={styles.searchBar}>
      <span className={styles.icon}><img src="icons/search.svg" alt="" /></span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Find Book..."
        className={styles.input}
      />
    </div>
  );
};

export default SearchBar;
