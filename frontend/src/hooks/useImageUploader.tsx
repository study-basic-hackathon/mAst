import React, { useRef, useCallback } from 'react';

type ImageChangeHandler = (file: File) => void;

/**
 * 画像アップロードのUIロジックをカプセル化するカスタムフック
 * @param onFileSelect - ファイルが選択されたときに呼び出されるコールバック関数
 * @returns triggerFileDialog - ファイル選択ダイアログを開く関数
 * @returns UploaderInputComponent - レンダリングが必要な非表示のinput要素
 */
export const useImageUploader = (onFileSelect: ImageChangeHandler) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択ダイアログをプログラムで開く
  const triggerFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ファイルが選択されたときの処理
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // 同じファイルを再度選択できるように、inputの値をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  // ページにレンダリングする必要がある非表示のinput要素
  const UploaderInputComponent: React.FC = () => (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: 'none' }}
      accept="image/*"
    />
  );

  return {
    triggerFileDialog,
    UploaderInputComponent,
  };
};
