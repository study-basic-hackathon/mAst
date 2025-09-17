import React, { useRef, useCallback } from 'react';

type ImageChangeHandler<T> = (file: File, context: T) => void;

/**
 * 画像アップロードのUIロジックをカプセル化するカスタムフック
 * @param onFileSelect - ファイルが選択されたときに呼び出されるコールバック関数
 * @returns triggerFileDialog - ファイル選択ダイアログを開く関数
 * @returns getInputProps - input要素に適用するプロパティを取得する関数
 */
export const useImageUploader = <T,>(onFileSelect: ImageChangeHandler<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextRef = useRef<T | null>(null);

  // ファイル選択ダイアログをプログラムで開く
  const triggerFileDialog = useCallback((context: T) => {
    contextRef.current = context;
    fileInputRef.current?.click();
  }, []);

  // ファイルが選択されたときの処理
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && contextRef.current !== null) {
      onFileSelect(file, contextRef.current);
    }
    // 同じファイルを再度選択できるように、inputの値をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    contextRef.current = null; // コンテキストをリセット
  }, [onFileSelect]);

  const getInputProps = useCallback(() => ({
    ref: fileInputRef,
    onChange: handleFileChange,
    style: { display: 'none' },
    accept: "image/*",
    type: "file" as const,
  }), [handleFileChange]);

  return {
    triggerFileDialog,
    getInputProps,
  };
};
