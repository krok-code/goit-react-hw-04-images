import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';
import { CloseButton } from 'react-bootstrap';

const modalRootRef = document.querySelector('#modal-root');

const Modal = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const showNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, images.length]);

  const showPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    document.body.style.overflow = 'hidden'; // Краще ніж fixed для скролу
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, showNext, showPrev]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  const currentImg = images[currentIndex];

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Кнопка Попередня */}
        {currentIndex > 0 && (
          <button
            className={styles.navBtn}
            style={{ left: '-60px' }}
            onClick={showPrev}
          >
            &#10094;
          </button>
        )}

        <img src={currentImg.largeImageURL} alt={currentImg.tags} />

        {/* Кнопка Наступна */}
        {currentIndex < images.length - 1 && (
          <button
            className={styles.navBtn}
            style={{ right: '-60px' }}
            onClick={showNext}
          >
            &#10095;
          </button>
        )}

        {/* Лічильник */}
        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="position-absolute top-0 end-0 p-3">
        <CloseButton onClick={onClose} variant="white" />
      </div>
    </div>,
    modalRootRef
  );
};

Modal.propTypes = {
  images: PropTypes.array.isRequired,
  initialIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
