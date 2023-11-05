import { configureStore, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';

import { mockNavigate, mockPop } from '@/jestSetup';
import ResetPassword from '@/pages/resetPassword';
import SentInstructions from '@/pages/resetPassword/components/sentInstruction';
import { Header } from '@/shared';

const mockSlice = createSlice({ name: 'mockSlice' });
const mockStore = configureStore({
    reducer: mockSlice.reducer
});

const tree = create(
    <Provider store={mockStore}>
        <ResetPassword />
    </Provider>
);
const header = tree.root.findByType(Header);
const emailInput = tree.root.findByProps({ placeholder: 'Email*' });
const resetPasswordButton = tree.root.findByProps({ primary: true });

test('snapshot', () => {
    expect(tree).toMatchSnapshot();
});

test('back button', async () => {
    await act(() => header.props.onLeftBtnPress());
    expect(mockPop).toBeCalled();
});

test('empty field', async () => {
    await act(() => resetPasswordButton.props.onPress());
    const successComponent = tree.root.findAllByType(SentInstructions);
    expect(successComponent).toHaveLength(0);
    const errorText = tree.root.findByProps({ color: '#D05151' });
    expect(errorText.props.children).toBe('Field is required');
});

let mockUnwrap;
jest.mock('@/hooks', () => ({
    useAppDispatch: () =>
        jest.fn().mockImplementation(() => ({
            unwrap: mockUnwrap
        }))
}));

test('unknown error', async () => {
    mockUnwrap = jest.fn().mockRejectedValue();
    await act(() => emailInput.props.onChangeText('invalidEmail'));
    await act(() => resetPasswordButton.props.onPress());
    expect(Toast.show).toBeCalledWith({
        type: 'errorResponse',
        text1: 'An unknown error has occurred',
        position: 'bottom'
    });
});

test('successful submit', async () => {
    mockUnwrap = jest.fn().mockResolvedValue();
    await act(() => emailInput.props.onChangeText('test@gmail.com'));
    await act(async () => await resetPasswordButton.props.onPress());
    const successComponent = tree.root.findAllByType(SentInstructions);
    expect(successComponent).toHaveLength(1);
    await act(() => header.props.onLeftBtnPress());
    expect(mockNavigate).toBeCalledWith('SignIn');
});
