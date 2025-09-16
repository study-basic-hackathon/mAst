import React, { useCallback } from 'react';
import { useConfirmationModal } from '@/hooks/useConfirmationModal';
import { useNotificationModal } from '@/hooks/useNotificationModal';
import ConfirmationModal from '@/components/Modal/ConfirmationModal';
import NotificationModal from '@/components/Modal/NotificationModal';
import { Part } from '@/api/partsApi';

interface UseEditPageModalsProps {
  onConfirmDelete: (partId: number) => void;
}

export const useEditPageModals = ({ onConfirmDelete }: UseEditPageModalsProps) => {
  // ... 既存のフック呼び出し
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

  // 変更破棄確認モーダル用のフック
  const {
    isModalOpen: isUnsavedChangesModalOpen,
    openModal: openUnsavedChangesModal,
    closeModal: closeUnsavedChangesModal,
    confirm: confirmUnsavedChanges,
  } = useConfirmationModal<null>();

  const handleOpenDeleteModal = useCallback((part: Part) => {
    openDeleteModal(part, () => onConfirmDelete(part.id));
  }, [openDeleteModal, onConfirmDelete]);

  const handleOpenUnsavedChangesModal = useCallback((onConfirm: () => void) => {
    openUnsavedChangesModal(null, onConfirm);
  }, [openUnsavedChangesModal]);

  const ModalsComponent: React.FC = useCallback(() => (
    <>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message={`「${partToDelete?.title}」を本当に削除しますか？`}
      />
      <ConfirmationModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={closeUnsavedChangesModal}
        onConfirm={confirmUnsavedChanges}
        message="変更中の内容は破棄されます。よろしいですか？"
      />
      <NotificationModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        message={successMessage}
      />
    </>
  ), [
    isDeleteModalOpen, closeDeleteModal, confirmDelete, partToDelete,
    isSuccessModalOpen, closeSuccessModal, successMessage,
    isUnsavedChangesModalOpen, closeUnsavedChangesModal, confirmUnsavedChanges,
  ]);

  return {
    openDeleteModal: handleOpenDeleteModal,
    openSuccessModal,
    openUnsavedChangesModal: handleOpenUnsavedChangesModal,
    ModalsComponent,
  };
};
