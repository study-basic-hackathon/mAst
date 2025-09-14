import React, { useState, useEffect } from 'react';
import CardEditor from '../components/Card/CardEditor';
import ConfirmationModal from '../components/Modal/ConfirmationModal';

interface Part {
  id: number;
  title: string;
  category: string;
  quantity: number;
}

const Edit: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<Part | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await fetch('/api/parts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setParts(data);
      } catch (error) {
        console.error('Failed to fetch parts:', error);
      }
    };

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
      // Filter out the deleted part from the state
      setParts(parts.filter(part => part.id !== id));
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

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="searchArea" style={{ alignItems: 'flex-start', flexBasis: '30%' }}>
        <div className="searchBox" style={{ height: '100%', width: '100%', backgroundColor: 'violet' }}></div>
      </div>

      <div className="cardList" style={{ display: 'grid', overflow: 'auto', height: '100%', width: '100%', marginTop: '10px' }}>
        {parts.map((part) => (
          <CardEditor
            key={part.id}
            title={part.title}
            category={part.category}
            quantity={part.quantity}
            handleDeleteClick={() => openConfirmationModal(part)}
          />
        ))}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmDelete}
        message={`「${partToDelete?.title}」を本当に削除しますか？`}
      />
    </div>
  );
};

export default Edit;
