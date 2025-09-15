import React, { useCallback } from 'react';
import { useConfirmationModal } from './useConfirmationModal';
import { useNotificationModal } from './useNotificationModal';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import NotificationModal from '../components/Modal/NotificationModal';
import { Part } from '../api/partsApi';

interface UseEditPageModalsProps {
  onConfirmDelete: (partId: number) => void;
}

export const useEditPageModals = ({ onConfirmDelete }: UseEditPageModalsProps) => {
  const {
    isModalOpen: isDeleteModalOpen,
    itemToProcess: partToDelete,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    confirm: confirmDelete,
  } = useConfirmationModal<Part>();

  const {
    isModalOpen: isSuccessModalOpen,
    message: successMessage,
    openModal: openSuccessModal,
    closeModal: closeSuccessModal,
  } = useNotificationModal();

  const handleOpenDeleteModal = useCallback((part: Part) => {
    openDeleteModal(part, () => onConfirmDelete(part.id));
  }, [openDeleteModal, onConfirmDelete]);

  const ModalsComponent: React.FC = useCallback(() => (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message={`「${partToDelete?.title}」を本当に削除しますか？`}
      />
      <NotificationModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message={successMessage}
      />
    </>
  ), [isDeleteModalOpen, closeDeleteModal, confirmDelete, partToDelete, isSuccessModalOpen, closeSuccessModal, successMessage]);

  return {
    openDeleteModal: handleOpenDeleteModal,
    openSuccessModal,
    ModalsComponent,
  };
};
