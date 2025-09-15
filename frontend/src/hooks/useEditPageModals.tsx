import React, { useCallback } from 'react';
import { useConfirmationModal } from './useConfirmationModal';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
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
    openModal: openSuccessModal,
    closeModal: closeSuccessModal,
  } = useConfirmationModal();

  const handleConfirmDelete = useCallback(() => {
    confirmDelete(part => onConfirmDelete(part.id));
  }, [confirmDelete, onConfirmDelete]);

  const ModalsComponent: React.FC = useCallback(() => (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        message={`「${partToDelete?.title}」を本当に削除しますか？`}
      />
      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        onConfirm={closeSuccessModal}
        message="更新が完了しました。"
        confirmLabel="OK"
        showCancelButton={false}
        confirmButtonColor="#4CAF50"
      />
    </>
  ), [isDeleteModalOpen, closeDeleteModal, handleConfirmDelete, partToDelete, isSuccessModalOpen, closeSuccessModal]);

  return {
    openDeleteModal,
    openSuccessModal,
    ModalsComponent,
  };
};
