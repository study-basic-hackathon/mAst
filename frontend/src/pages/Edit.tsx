import React, { useRef, useState } from 'react';
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
    stageImageChange,
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);

  const handleImageClick = (partId: number) => {
    setSelectedPartId(partId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const partId = selectedPartId;

    if (file && partId !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageUrl = reader.result as string;
        // プレビュー表示と、アップロード用のファイル情報をフックに渡す
        stageImageChange(partId, newImageUrl, file);
      };
      reader.readAsDataURL(file);
    }
    // 同じファイルを再度選択できるように、inputの値をリセットします
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setSelectedPartId(null);
  };

  const handleConfirmDelete = () => {
    confirm(part => handleDelete(part.id));
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
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
