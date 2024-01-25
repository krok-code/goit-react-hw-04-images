import styles from '../App.module.css';
import SearchBar from './SearchBar/SearchBar';

export const App = () => {
  return (
    <div className={styles.app}>
      <SearchBar>Test</SearchBar>
    </div>
  );
};
