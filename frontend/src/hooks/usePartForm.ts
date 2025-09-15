import { useState, useCallback } from 'react';
import { useImageUploader } from './useImageUploader';

interface UsePartFormProps {
  onSave: (newPart: { title: string; categoryId: number; quantity: number; image?: File }) => void;
}

export const usePartForm = ({ onSave }: UsePartFormProps) => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState(0);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

    const handleFileSelected = useCallback((file: File) => {
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    }, []);

    const { triggerFileDialog, getInputProps } = useImageUploader(handleFileSelected);

    const handleSave = useCallback(() => {
        if (categoryId === '' || title.trim() === '') return;
        onSave({ title, categoryId, quantity, image });
    }, [title, categoryId, quantity, image, onSave]);

    const isSaveDisabled = categoryId === '' || title.trim() === '';

    return {
        title,
        setTitle,
        categoryId,
        setCategoryId,
        quantity,
        setQuantity,
        previewUrl,
        isSaveDisabled,
        handleSave,
        triggerFileDialog,
        getInputProps,
    };
};
