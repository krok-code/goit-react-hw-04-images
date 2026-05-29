import React, { useEffect, useState } from 'react';
import styles from '../App.module.css';
import { fetchImages, IMAGES_PER_PAGE } from 'api/fetch-data';
import SearchForm from './SearchForm/SearchForm';
import SearchBar from './SearchBar/SearchBar';
import Notification from './Notification';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const NOTIFICATION_TYPE = {
  success: 'success',
  error: 'danger',
  warning: 'warning',
  info: 'info',
};

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null); // Стан для системних даних
  const [notification, setNotification] = useState({
    type: NOTIFICATION_TYPE.info,
    message: '',
  });
  const [showNotification, setShowNotification] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoadMoreBtn, setIsLoadMore] = useState(false);

  const handleNotification = (type, message) => {
    setNotification({ type, message });
    setShowNotification(true);
  };

  // 1. Отримуємо системну інформацію при завантаженні (Взаємодія з ОС через Node.js)
  useEffect(() => {
    fetch('http://localhost:5000/api/system')
      .then(res => res.json())
      .then(data => setSystemInfo(data))
      .catch(err => console.log('Backend server is not running yet'));
  }, []);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setIsLoader(true);
      try {
        const data = await fetchImages(query, page);
        if (!data.totalHits) {
          handleNotification(NOTIFICATION_TYPE.info, 'No images found.');
          setIsLoader(false);
          return;
        }
        setImages(prevImages => [...prevImages, ...data.hits]);
        setIsLoadMore(page < Math.ceil(data.totalHits / IMAGES_PER_PAGE));
      } catch (error) {
        handleNotification(NOTIFICATION_TYPE.error, error.message);
      } finally {
        setIsLoader(false);
      }
    };
    fetchData();
  }, [query, page]);

  const handleSearchFormSubmit = inputQuery => {
    if (!inputQuery) return;

    // 2. Логування запиту у файл (Взаємодія з Файловою системою через Node.js)
    fetch('http://localhost:5000/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: inputQuery }),
    }).catch(e => console.log('Logging failed'));

    setQuery(inputQuery);
    setPage(1);
    setImages([]);
  };

  const handleImageClick = index => {
    setSelectedImageIndex(index);
  };

  return (
    <div className={styles.app}>
      {/* Системний віджет для викладача */}
      {systemInfo && (
        <div
          style={{
            backgroundColor: '#2c3e50',
            color: '#ecf0f1',
            padding: '5px 20px',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #34495e',
          }}
        >
          <span>💻 OS: {systemInfo.platform}</span>
          <span>🧠 CPU Cores: {systemInfo.cpus}</span>
          <span>📊 RAM Free: {systemInfo.freeMem}</span>
          <span>⏱️ System Uptime: {systemInfo.uptime}</span>
        </div>
      )}

      <SearchBar>
        <SearchForm onSubmit={handleSearchFormSubmit} />
      </SearchBar>

      {showNotification && (
        <Notification
          type={notification.type}
          onClose={() => setShowNotification(false)}
        >
          {notification.message}
        </Notification>
      )}

      <ImageGallery images={images} onImageClick={handleImageClick} />

      {isLoader && <Loader />}

      {isLoadMoreBtn && (
        <Button onClick={() => setPage(p => p + 1)}>Load more</Button>
      )}

      {selectedImageIndex !== null && (
        <Modal
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </div>
  );
};

export default App;
