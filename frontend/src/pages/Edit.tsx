import React, { useRef } from 'react';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import PartCardList from '../components/page_components/Edit/PartCardList';
import EditPageActions from '../components/page_components/Edit/EditPageActions';
import { usePartsManager, Part } from '../hooks/usePartsManager';
import { useConfirmationModal } from '../hooks/useConfirmationModal';
import { useImageUploader } from '../hooks/useImageUploader';

const Edit: React.FC = () => {
  const {
    parts,
    initialParts,
    isUpdating,
    error,
    hasChanges,
    handleQuantityChange,
    stageImageChange,
    handleCancel,
    handleUpdate,
    handleDelete,
    handleSaveNewPart,
  } = usePartsManager();

  const {
    isModalOpen,
    itemToProcess,
    openModal,
    closeModal,
    confirm,
  } = useConfirmationModal<Part>();

  const handleFileSelected = (file: File, partId: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImageUrl = reader.result as string;
      stageImageChange(partId, newImageUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const { triggerFileDialog: handleImageClick, getInputProps } = useImageUploader<number>(handleFileSelected);

  const handleConfirmDelete = () => {
    confirm(part => handleDelete(part.id));
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <input {...getInputProps()} />
      <div className="searchArea" style={{ alignItems: 'flex-start', flexBasis: '30%' }}>
        <div className="searchBox" style={{ height: '100%', width: '100%', backgroundColor: 'violet' }}></div>
      </div>

      {error && <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>{error}</div>}

      <PartCardList
        parts={parts}
        initialParts={initialParts}
        onQuantityChange={handleQuantityChange}
        onDeleteClick={openModal}
        onImageClick={handleImageClick}
        onSaveNewPart={handleSaveNewPart}
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
