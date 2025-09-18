import React, { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import PartCardList from '@/components/page_components/Edit/PartCardList';
import EditPageActions from '@/components/page_components/Edit/EditPageActions';
import SearchForm from '@/components/common/SearchForm';
import { usePartsManager } from '@/hooks/parts/usePartsManager';
import { useImageUploader } from '@/hooks/ui/useImageUploader';
import { useEditPageModals } from '@/hooks/ui/useEditPageModals';
import { useCategories } from '@/hooks/useCategories';

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
    search,
  } = usePartsManager();

  const { categories } = useCategories();

  const {
    openDeleteModal,
    openSuccessModal,
    openUnsavedChangesModal,
    ModalsComponent,
  } = useEditPageModals({
    onConfirmDelete: handleDelete,
  });

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasChanges && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      openUnsavedChangesModal(() => {
        blocker.proceed?.();
      });
    }
  }, [blocker, openUnsavedChangesModal]);

  useEffect(() => {
    if (isUpdateSuccessful) {
      openSuccessModal('更新が完了しました。');
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
      <div className="searchArea" style={{ padding: '20px' }}>
        <SearchForm categories={categories} onSearch={search} />
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
