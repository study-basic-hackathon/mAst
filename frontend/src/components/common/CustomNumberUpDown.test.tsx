import { render, screen, fireEvent } from '@testing-library/react';
import CustomNumberUpDown from './CustomNumberUpDown';
import { describe, it, expect, vi } from 'vitest';

describe('CustomNumberUpDown', () => {
    it('初期値で正しくレンダリングされる', () => {
        render(<CustomNumberUpDown value={5} onValueChange={() => {}} />);
        const input = screen.getByDisplayValue('5');
        expect(input).toBeInTheDocument();
    });

    it('プラスボタンをクリックするとonValueChangeが増加した値で呼び出される', () => {
        const handleValueChange = vi.fn();
        render(<CustomNumberUpDown value={5} onValueChange={handleValueChange} />);
        const plusButton = screen.getByTestId('plus-button');
        fireEvent.click(plusButton);
        expect(handleValueChange).toHaveBeenCalledWith(6);
    });

    it('マイナスボタンをクリックするとonValueChangeが減少した値で呼び出される', () => {
        const handleValueChange = vi.fn();
        render(<CustomNumberUpDown value={5} onValueChange={handleValueChange} />);
        const minusButton = screen.getByTestId('minus-button');
        fireEvent.click(minusButton);
        expect(handleValueChange).toHaveBeenCalledWith(4);
    });

    it('0未満にはならない', () => {
        const handleValueChange = vi.fn();
        render(<CustomNumberUpDown value={0} onValueChange={handleValueChange} />);
        const minusButton = screen.getByTestId('minus-button');
        fireEvent.click(minusButton);
        expect(handleValueChange).toHaveBeenCalledWith(0);
    });

    it('入力値が変更されるとonValueChangeが呼び出される', () => {
        const handleValueChange = vi.fn();
        render(<CustomNumberUpDown value={5} onValueChange={handleValueChange} />);
        const input = screen.getByDisplayValue('5');
        fireEvent.change(input, { target: { value: '10' } });
        expect(handleValueChange).toHaveBeenCalledWith(10);
    });

    it('値がinitialValueと異なるときに背景色が変わる', () => {
        const { rerender } = render(<CustomNumberUpDown value={5} onValueChange={() => {}} initialValue={5} />);
        const component = screen.getByDisplayValue('5').parentElement;
        // 'transparent' can be rendered as 'rgba(0, 0, 0, 0)'
        expect(component?.style.backgroundColor).toBe('transparent');

        rerender(<CustomNumberUpDown value={6} onValueChange={() => {}} initialValue={5} />);
        expect(component).toHaveStyle('background-color: #fff6b6');
    });
});
