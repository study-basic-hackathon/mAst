import React from 'react';

interface EditPageActionsProps {
  onCancel: () => void;
  onUpdate: () => void;
  hasChanges: boolean;
  isUpdating: boolean;
}

const EditPageActions: React.FC<EditPageActionsProps> = ({ onCancel, onUpdate, hasChanges, isUpdating }) => {
  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
  };

  const disabledStyle: React.CSSProperties = {
    cursor: 'not-allowed',
    opacity: 0.6,
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ccc' }}>
      <button
        onClick={onCancel}
        disabled={!hasChanges || isUpdating}
        style={{ ...buttonStyle, backgroundColor: '#ccc', ...( !hasChanges || isUpdating ? disabledStyle : {}) }}
      >
        キャンセル
      </button>
      <button
        onClick={onUpdate}
        disabled={!hasChanges || isUpdating}
        style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white', ...( !hasChanges || isUpdating ? disabledStyle : {}) }}
      >
        {isUpdating ? '更新中...' : '更新'}
      </button>
    </div>
  );
};

export default EditPageActions;
