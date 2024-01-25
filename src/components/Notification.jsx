import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Toast, ToastContainer } from 'react-bootstrap';

const notificationsRootRef = document.querySelector('#notifications-root');

function Notification({ type, onClose, children }) {
  return createPortal(
    <ToastContainer position="top-end" className="p-3">
      <Toast bg={type} delay={3000} autohide onClose={onClose}>
        <Toast.Header>
          <strong className="me-auto text-capitalize">{type}</strong>
        </Toast.Header>
        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </ToastContainer>,
    notificationsRootRef
  );
}

Notification.propTypes = {
  type: PropTypes.string.isRequired,
  onclose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Notification;
