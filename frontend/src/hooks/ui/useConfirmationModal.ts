import { useState, useCallback } from 'react';

export const useConfirmationModal = <T>() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToProcess, setItemToProcess] = useState<T | null>(null);
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

  const openModal = useCallback((item: T | null, onConfirm: () => void) => {
    setItemToProcess(item);
    setOnConfirmAction(() => onConfirm);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setItemToProcess(null);
    setOnConfirmAction(null);
    setIsModalOpen(false);
  }, []);

  const confirm = useCallback(() => {
    if (onConfirmAction) {
      onConfirmAction();
      closeModal();
    }
  }, [onConfirmAction, closeModal]);

  return {
    isModalOpen,
    itemToProcess,
    openModal,
    closeModal,
    confirm,
  };
};
