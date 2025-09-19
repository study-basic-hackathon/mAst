import { useState, useCallback } from 'react';

export const useNotificationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const openModal = useCallback((newMessage: string) => {
    setMessage(newMessage);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setMessage('');
  }, []);

  return {
    isModalOpen,
    message,
    openModal,
    closeModal,
  };
};
