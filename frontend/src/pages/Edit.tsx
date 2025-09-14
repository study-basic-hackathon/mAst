import React from 'react';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import PartCardList from '../components/page_components/Edit/PartCardList';
import EditPageActions from '../components/page_components/Edit/EditPageActions';
import { usePartsManager, Part } from '../hooks/usePartsManager';
import { useConfirmationModal } from '../hooks/useConfirmationModal';

const Edit: React.FC = () => {
  const {
    parts,
    initialParts,
    isUpdating,
    error,
    hasChanges,
    handleQuantityChange,
    handleCancel,
    handleUpdate,
    handleDelete,
  } = usePartsManager();

  const {
    isModalOpen,
    itemToProcess,
    openModal,
    closeModal,
    confirm,
  } = useConfirmationModal<Part>();

  const handleConfirmDelete = () => {
    confirm(part => handleDelete(part.id));
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="searchArea" style={{ alignItems: 'flex-start', flexBasis: '30%' }}>
        <div className="searchBox" style={{ height: '100%', width: '100%', backgroundColor: 'violet' }}></div>
      </div>

      {error && <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>{error}</div>}

      <PartCardList
        parts={parts}
        initialParts={initialParts}
        onQuantityChange={handleQuantityChange}
        onDeleteClick={openModal}
      />
      
      <EditPageActions
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        hasChanges={hasChanges}
        isUpdating={isUpdating}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        message={`「${itemToProcess?.title}」を本当に削除しますか？`}
      />
    </div>
  );
};

export default Edit;
