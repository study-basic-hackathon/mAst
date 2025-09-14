import { useState, useCallback } from 'react';

export const useConfirmationModal = <T>() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToProcess, setItemToProcess] = useState<T | null>(null);

  const openModal = useCallback((item: T) => {
    setItemToProcess(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setItemToProcess(null);
    setIsModalOpen(false);
  }, []);

  const confirm = useCallback((action: (item: T) => void) => {
    if (itemToProcess) {
      action(itemToProcess);
      closeModal();
    }
  }, [itemToProcess, closeModal]);

  return {
    isModalOpen,
    itemToProcess,
    openModal,
    closeModal,
    confirm,
  };
};
