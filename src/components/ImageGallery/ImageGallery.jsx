import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGallery.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

// Додаємо проп onImageClick
const ImageGallery = ({ images, onImageClick }) => {
  return (
    <ul className={styles.gallery}>
      {images.map(({ id, ...image }, index) => {
        return (
          <ImageGalleryItem
            key={id}
            {...image}
            // Передаємо функцію кліку та індекс картинки
            onClick={() => onImageClick(index)}
          />
        );
      })}
    </ul>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  onImageClick: PropTypes.func.isRequired, // Додаємо валідацію нового пропа
};

export default ImageGallery;
