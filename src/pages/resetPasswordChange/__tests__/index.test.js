import { configureStore, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';

import ResetPasswordChange from '@/pages/resetPasswordChange';
import {
    ResetFailed,
    ResetSuccess
} from '@/pages/resetPasswordChange/components';

const mockSlice = createSlice({ name: 'mockSlice' });
const mockStore = configureStore({
    reducer: mockSlice.reducer
});

let mockUnwrap;
jest.mock('@/hooks', () => ({
    useAppDispatch: () =>
        jest.fn().mockImplementation(() => ({
            unwrap: mockUnwrap
        }))
}));

let tree;

beforeEach(async () => {
    mockUnwrap = jest.fn().mockResolvedValue();
    tree = await act(() =>
        create(
            <Provider store={mockStore}>
                <ResetPasswordChange />
            </Provider>
        )
    );
});

test('snapshot', () => {
    expect(tree).toMatchSnapshot();
});

test('empty field', async () => {
    const resetPasswordButton = tree.root.findByProps({ primary: true });
    expect(resetPasswordButton.props.disabled).toBeTruthy();
});

test('Invalid Token', async () => {
    mockUnwrap = jest.fn().mockRejectedValue({
        data: {
            code: 'bad_token'
        }
    });
    await act(
        async () =>
            await tree.update(
                <Provider store={mockStore}>
                    <ResetPasswordChange />
                </Provider>
            )
    );
    const resetFailedComponent = tree.root.findAllByType(ResetFailed);
    expect(resetFailedComponent).toHaveLength(1);
});

test('change password success', async () => {
    const resetPasswordButton = tree.root.findByProps({ primary: true });
    const password = tree.root.findByProps({
        placeholder: 'Create a New Password*'
    });
    const confirmPassword = tree.root.findByProps({
        placeholder: 'Repeat Password*'
    });
    await act(() => password.props.onChangeText('123456'));
    await act(() => confirmPassword.props.onChangeText('123456'));
    expect(resetPasswordButton.props.disabled).not.toBeTruthy();
    await act(() => resetPasswordButton.props.onPress());
    const resetSuccessComponent = tree.root.findAllByType(ResetSuccess);
    expect(resetSuccessComponent).toHaveLength(1);
});

test('password mismatch', async () => {
    const resetPasswordButton = tree.root.findByProps({ primary: true });
    const password = tree.root.findByProps({
        placeholder: 'Create a New Password*'
    });
    const confirmPassword = tree.root.findByProps({
        placeholder: 'Repeat Password*'
    });
    await act(() => password.props.onChangeText('123456'));
    await act(() => confirmPassword.props.onChangeText('12345'));
    expect(resetPasswordButton.props.disabled).toBeTruthy();
});

test('change password failed', async () => {
    const resetPasswordButton = tree.root.findByProps({ primary: true });
    const password = tree.root.findByProps({
        placeholder: 'Create a New Password*'
    });
    const confirmPassword = tree.root.findByProps({
        placeholder: 'Repeat Password*'
    });
    await act(() => password.props.onChangeText('123456'));
    await act(() => confirmPassword.props.onChangeText('123456'));
    expect(resetPasswordButton.props.disabled).not.toBeTruthy();
    mockUnwrap = jest.fn().mockRejectedValue({
        status: 400,
        data: {
            code: 'password_does_not_conform'
        }
    });
    await act(() => resetPasswordButton.props.onPress());
    expect(Toast.show).toBeCalledWith({
        type: 'errorResponse',
        text1: 'Password must be at least 8 characters long or more complex',
        position: 'bottom'
    });
});

test('change password Invalid Token', async () => {
    const resetPasswordButton = tree.root.findByProps({ primary: true });
    const password = tree.root.findByProps({
        placeholder: 'Create a New Password*'
    });
    const confirmPassword = tree.root.findByProps({
        placeholder: 'Repeat Password*'
    });
    await act(() => password.props.onChangeText('123456'));
    await act(() => confirmPassword.props.onChangeText('123456'));
    expect(resetPasswordButton.props.disabled).not.toBeTruthy();
    mockUnwrap = jest.fn().mockRejectedValue({
        status: 400,
        data: {
            code: 'bad_token'
        }
    });
    await act(() => resetPasswordButton.props.onPress());
    const resetFailedComponent = tree.root.findAllByType(ResetFailed);
    expect(resetFailedComponent).toHaveLength(1);
});

test('change password unknown error', async () => {
    const resetPasswordButton = tree.root.findByProps({ primary: true });
    const password = tree.root.findByProps({
        placeholder: 'Create a New Password*'
    });
    const confirmPassword = tree.root.findByProps({
        placeholder: 'Repeat Password*'
    });
    await act(() => password.props.onChangeText('123456'));
    await act(() => confirmPassword.props.onChangeText('123456'));
    expect(resetPasswordButton.props.disabled).not.toBeTruthy();
    mockUnwrap = jest.fn().mockRejectedValue({
        status: 400,
        data: {
            code: ''
        }
    });
    await act(() => resetPasswordButton.props.onPress());
    expect(Toast.show).toBeCalledWith({
        type: 'errorResponse',
        text1: 'An unknown error has occurred',
        position: 'bottom'
    });
});
