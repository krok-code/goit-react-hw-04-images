import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';
import { CloseButton } from 'react-bootstrap';

const modalRootRef = document.querySelector('#modal-root');

const Modal = ({ url, onClose }) => {
  useEffect(() => {
    const handlerKeyDownEsc = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
  });
};
