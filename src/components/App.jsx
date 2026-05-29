import React, { useEffect, useState } from 'react';
import styles from '../App.module.css';
import { fetchImages, IMAGES_PER_PAGE } from 'api/fetch-data';
import SearchForm from './SearchForm/SearchForm';
import SearchBar from './SearchBar/SearchBar';
import Notification from './Notification';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal'; // Переконайтеся, що імпорт є

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Стан для індексу
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
    setQuery(inputQuery);
    setPage(1);
    setImages([]);
  };

  const handleImageClick = index => {
    setSelectedImageIndex(index);
  };

  return (
    <div className={styles.app}>
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

      {/* Передаємо функцію кліку в галерею */}
      <ImageGallery images={images} onImageClick={handleImageClick} />

      {isLoader && <Loader />}

      {isLoadMoreBtn && (
        <Button onClick={() => setPage(p => p + 1)}>Load more</Button>
      )}

      {/* Якщо індекс вибрано - відкриваємо модалку */}
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
