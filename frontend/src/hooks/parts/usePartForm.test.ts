import { renderHook, act } from '@testing-library/react';
import { usePartForm } from './usePartForm';
import { describe, it, expect, vi } from 'vitest';

// URL.createObjectURL is not defined in JSDOM, so we need to mock it.
// see: frontend/src/test/setup.ts
// global.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('usePartForm', () => {
    it('デフォルト値で初期化されるべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        expect(result.current.title).toBe('');
        expect(result.current.categoryId).toBe('');
        expect(result.current.quantity).toBe(0);
        expect(result.current.previewUrl).toBeUndefined();
        expect(result.current.isSaveDisabled).toBe(true);
    });

    it('タイトルを更新すべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setTitle('New Part');
        });

        expect(result.current.title).toBe('New Part');
    });

    it('カテゴリIDを更新すべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setCategoryId(1);
        });

        expect(result.current.categoryId).toBe(1);
    });

    it('数量を更新すべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setQuantity(10);
        });

        expect(result.current.quantity).toBe(10);
    });

    it('タイトルとカテゴリIDが設定されたら保存ボタンを有効にすべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setTitle('New Part');
            result.current.setCategoryId(1);
        });

        expect(result.current.isSaveDisabled).toBe(false);
    });

    it('正しいデータでonSaveを呼び出すべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setTitle('New Part');
            result.current.setCategoryId(1);
            result.current.setQuantity(10);
        });

        act(() => {
            result.current.handleSave();
        });

        expect(onSave).toHaveBeenCalledWith({
            title: 'New Part',
            categoryId: 1,
            quantity: 10,
            image: undefined,
        });
    });

    it('タイトルがない場合はonSaveを呼び出さないべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setCategoryId(1);
        });

        act(() => {
            result.current.handleSave();
        });

        expect(onSave).not.toHaveBeenCalled();
    });

    it('カテゴリIDがない場合はonSaveを呼び出さないべき', () => {
        const onSave = vi.fn();
        const { result } = renderHook(() => usePartForm({ onSave }));

        act(() => {
            result.current.setTitle('New Part');
        });

        act(() => {
            result.current.handleSave();
        });

        expect(onSave).not.toHaveBeenCalled();
    });
});
