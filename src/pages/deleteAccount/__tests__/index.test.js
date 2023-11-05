import { configureStore, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';

import {
    mockDeleteAccount,
    mockDispatch,
    mockGoBack,
    mockNavigationDispatch,
    mockUnwrap
} from '@/jestSetup';
import DeleteAccount from '@/pages/deleteAccount';
import { Header, Input } from '@/shared';
import * as auth from '@/utils/auth';

const tree = create(
    <Provider
        store={configureStore({
            reducer: createSlice({ name: 'mock' }).reducer
        })}
    >
        <DeleteAccount />
    </Provider>
);

test('snapshot', () => {
    expect(tree.toJSON()).toMatchSnapshot();
});

test('back button', () => {
    const backButton = tree.root.findByType(Header);
    act(() => backButton.props.onLeftBtnPress());
    expect(mockGoBack).toBeCalled();
});

test('cancel button', () => {
    const cancelButton = tree.root.findByProps({ testID: 'cancelButton' });
    act(() => cancelButton.props.onPress());
    expect(mockGoBack).toBeCalled();
});

test('proceed button', () => {
    let pageTitle = tree.root.findByProps({ testID: 'pageTitle' });
    let pageSubtitle = tree.root.findByProps({ testID: 'pageSubtitle' });
    expect(pageTitle.props.children).toStrictEqual(['Delete Account', false]);
    expect(pageSubtitle.props.children).toStrictEqual([
        'Deleting your account is an irreversible action that will permanently remove all your data from our system.',
        false
    ]);
    const proceedButton = tree.root.findByProps({ testID: 'proceedButton' });
    act(() => proceedButton.props.onPress());
    pageTitle = tree.root.findByProps({ testID: 'pageTitle' });
    pageSubtitle = tree.root.findByProps({ testID: 'pageSubtitle' });
    expect(pageTitle.props.children).toStrictEqual([
        false,
        'Confirm Account Deletion'
    ]);
    expect(pageSubtitle.props.children).toStrictEqual([
        false,
        'Please enter your account password to proceed with the account deletion process'
    ]);
    expect(tree.root.findAllByType(Input)).toHaveLength(1);
});

test('proceed without password', () => {
    const proceedButton = tree.root.findByProps({ testID: 'proceedButton' });
    act(() => proceedButton.props.onPress());
    expect(tree.root.findByType(Input).findByType(Text).props.children).toBe(
        'This field is required'
    );
    expect(mockDispatch).not.toBeCalled();
});

test('proceed with password success', async () => {
    const mockLogoutAction = jest.fn().mockImplementation(() => {});
    jest.spyOn(auth, 'logoutAction').mockImplementation(mockLogoutAction);
    const proceedButton = tree.root.findByProps({ testID: 'proceedButton' });
    act(() => proceedButton.props.onPress());
    act(() => tree.root.findByType(Input).props.onChangeText('validPassword'));
    await act(() => proceedButton.props.onPress());
    expect(mockDispatch).toBeCalled();
    expect(mockDeleteAccount).toBeCalledWith({ password: 'validPassword' });
    expect(mockLogoutAction).toBeCalledWith(true);
    expect(mockNavigationDispatch).toBeCalledWith({
        payload: {
            index: 1,
            routes: [{ name: 'SignIn' }, { name: 'DeleteAccountSuccess' }]
        },
        type: 'RESET'
    });
});

test('proceed with password error bad_credentials', async () => {
    mockUnwrap.mockRejectedValueOnce({ data: { code: 'bad_credentials' } });
    const proceedButton = tree.root.findByProps({ testID: 'proceedButton' });
    act(() => proceedButton.props.onPress());
    act(() =>
        tree.root.findByType(Input).props.onChangeText('invalidPassword')
    );
    await act(() => proceedButton.props.onPress());
    expect(mockDispatch).toBeCalled();
    expect(mockDeleteAccount).toBeCalledWith({ password: 'invalidPassword' });
    expect(Toast.show).toBeCalledWith({
        type: 'errorResponse',
        text1: 'Provided password is incorrect',
        position: 'bottom'
    });
});

test('proceed with password error something went wrong', async () => {
    mockUnwrap.mockRejectedValueOnce({
        data: { code: 'something_went_wrong' }
    });
    const proceedButton = tree.root.findByProps({ testID: 'proceedButton' });
    act(() => proceedButton.props.onPress());
    act(() =>
        tree.root.findByType(Input).props.onChangeText('invalidPassword')
    );
    await act(() => proceedButton.props.onPress());
    expect(mockDispatch).toBeCalled();
    expect(mockDeleteAccount).toBeCalledWith({ password: 'invalidPassword' });
    expect(Toast.show).toBeCalledWith({
        type: 'errorResponse',
        text1: 'Something went wrong! Please try again',
        position: 'bottom'
    });
});
