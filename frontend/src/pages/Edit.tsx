import React, { useEffect } from 'react';
import PartCardList from '../components/page_components/Edit/PartCardList';
import EditPageActions from '../components/page_components/Edit/EditPageActions';
import { usePartsManager } from '../hooks/usePartsManager';
import { useImageUploader } from '../hooks/useImageUploader';
import { useEditPageModals } from '../hooks/useEditPageModals';

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
    isUpdateSuccessful,
    resetUpdateStatus,
  } = usePartsManager();

  const {
    openDeleteModal,
    openSuccessModal,
    ModalsComponent,
  } = useEditPageModals({
    onConfirmDelete: handleDelete,
  });

  useEffect(() => {
    if (isUpdateSuccessful) {
      openSuccessModal();
      resetUpdateStatus(); // モーダルを開いたらすぐにステータスをリセット
    }
  }, [isUpdateSuccessful, openSuccessModal, resetUpdateStatus]);

  const handleFileSelected = (file: File, partId: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImageUrl = reader.result as string;
      stageImageChange(partId, newImageUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const { triggerFileDialog: handleImageClick, getInputProps } = useImageUploader<number>(handleFileSelected);

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <ModalsComponent />
      <input {...getInputProps()} />
      <div className="searchArea" style={{ alignItems: 'flex-start', flexBasis: '30%' }}>
        <div className="searchBox" style={{ height: '100%', width: '100%', backgroundColor: 'violet' }}></div>
      </div>

      {error && <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>{error}</div>}

      <PartCardList
        parts={parts}
        initialParts={initialParts}
        onQuantityChange={handleQuantityChange}
        onDeleteClick={openDeleteModal}
        onImageClick={handleImageClick}
        onSaveNewPart={handleSaveNewPart}
      />
      
      <EditPageActions
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        hasChanges={hasChanges}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default Edit;
