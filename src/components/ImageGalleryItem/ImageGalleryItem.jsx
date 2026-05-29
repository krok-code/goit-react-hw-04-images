import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.css';

// Ми видалили useState і Modal звідси.
// Тепер цей компонент просто малює картинку і каже "мене клікнули".
const ImageGalleryItem = ({
  webformatURL,
  tags,
  onClick, // Цей проп приходить від ImageGallery
}) => {
  return (
    <li className={styles.galleryItem} onClick={onClick}>
      <img className={styles.galleryItemImage} src={webformatURL} alt={tags} />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ImageGalleryItem;
