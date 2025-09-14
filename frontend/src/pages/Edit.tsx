import React, { useState, useEffect, useMemo } from 'react';
import CardEditor from '../components/Card/CardEditor';
import ConfirmationModal from '../components/Modal/ConfirmationModal';

interface Part {
  id: number;
  inventoryId: number;
  title: string;
  category: string;
  quantity: number;
}

const Edit: React.FC = () => {
  const [initialParts, setInitialParts] = useState<Part[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<Part | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchParts = async () => {
    try {
      const response = await fetch('/api/parts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Deep copy for the initial state to prevent mutation
      setInitialParts(JSON.parse(JSON.stringify(data)));
      setParts(data);
    } catch (error) {
      console.error('Failed to fetch parts:', error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/parts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Refetch data after deletion to ensure consistency
      await fetchParts();
    } catch (error) {
      console.error('Failed to delete part:', error);
    }
  };

  const openConfirmationModal = (part: Part) => {
    setPartToDelete(part);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setPartToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (partToDelete) {
      handleDelete(partToDelete.id);
      closeConfirmationModal();
    }
  };

  const handleQuantityChange = (partId: number, newQuantity: number) => {
    setParts(currentParts =>
      currentParts.map(p => (p.id === partId ? { ...p, quantity: newQuantity } : p))
    );
  };

  const handleCancel = () => {
    // Reset to the last fetched state
    setParts(JSON.parse(JSON.stringify(initialParts)));
  };

  const handleUpdate = async () => {
    const changedParts = parts.filter((part) => {
        const initialPart = initialParts.find(p => p.id === part.id);
        return initialPart && initialPart.quantity !== part.quantity;
    });

    if (changedParts.length === 0) {
      return; // No changes to update
    }

    const payload = changedParts.map(p => ({ id: p.inventoryId, quantity: p.quantity }));

    setIsUpdating(true);
    try {
      const response = await fetch('/api/inventory/batch', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Refetch data to confirm update and get a fresh initial state
      await fetchParts(); 
      
    } catch (error) {
      console.error('Failed to update inventory:', error);
      // Revert changes on failure
      handleCancel();
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(initialParts) !== JSON.stringify(parts);
  }, [initialParts, parts]);

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="searchArea" style={{ alignItems: 'flex-start', flexBasis: '30%' }}>
        <div className="searchBox" style={{ height: '100%', width: '100%', backgroundColor: 'violet' }}></div>
      </div>

      <div className="cardList" style={{ display: 'grid', overflow: 'auto', flexGrow: 1, width: '100%', marginTop: '10px' }}>
        {parts.map((part) => {
          const initialPart = initialParts.find(p => p.id === part.id);
          return (
            <CardEditor
              key={part.id}
              title={part.title}
              category={part.category}
              quantity={part.quantity}
              initialQuantity={initialPart ? initialPart.quantity : 0}
              onQuantityChange={(newQuantity) => handleQuantityChange(part.id, newQuantity)}
              handleDeleteClick={() => openConfirmationModal(part)}
            />
          );
        })}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmDelete}
        message={`「${partToDelete?.title}」を本当に削除しますか？`}
      />
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ccc' }}>
        <button onClick={handleCancel} disabled={!hasChanges || isUpdating} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          キャンセル
        </button>
        <button onClick={handleUpdate} disabled={!hasChanges || isUpdating} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: hasChanges ? '#4CAF50' : '#ccc', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isUpdating ? '更新中...' : '更新'}
        </button>
      </div>
    </div>
  );
};

export default Edit;
