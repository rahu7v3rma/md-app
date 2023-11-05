import React from 'react';
import 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import LogIn from '@/pages/login';
import store from '@/store';

let mockUnwrap: any;
jest.mock('@/hooks', () => ({
    useAppDispatch: () =>
        jest.fn().mockImplementation(() => ({
            unwrap: mockUnwrap
        }))
}));
let tree: ReactTestRenderer;

describe('Login', () => {
    beforeAll(async () => {
        tree = renderer.create(
            <Provider store={store}>
                <LogIn />
            </Provider>
        );
        const emailInput = tree.root.findByProps({
            testID: 'emailInput'
        }).props;
        const passwordInput = tree.root.findByProps({
            testID: 'passwordInput'
        }).props;
        await act(() => emailInput.onChangeText('test@gmail.com'));
        await act(() => passwordInput.onChangeText('12345678'));
    });

    it('login Snapshot Testing with Jest', async () => {
        expect(tree).toMatchSnapshot();
    });

    it('login renders correctly', async () => {
        expect(tree.root).toBeTruthy();
    });

    it('Login toggles password visibility', async () => {
        const passwordInputIcon = tree.root.findByProps({
            testID: 'passwordInputIcon'
        }).props;
        act(() => {
            passwordInputIcon.onPress();
        });
        const passwordInput = tree.root.findByProps({
            testID: 'passwordInput'
        }).props;
        expect(passwordInput.secureTextEntry).toBe(false);
    });

    it('login calls userLogin action and navigates to Main on successful login', async () => {
        mockUnwrap = jest.fn().mockResolvedValue({});
        const signInButton = tree.root.findByProps({ testID: 'signInButton' });
        await act(() => signInButton.props.onPress());
        expect(mockNavigate).toBeCalledWith('Main');
    });

    it('login navigates to ChangePassword on 403 status code', async () => {
        mockUnwrap = jest.fn().mockRejectedValue({ status: 403 });
        const signInButton = tree.root.findByProps({ testID: 'signInButton' });
        await act(() => signInButton.props.onPress());
        expect(mockNavigate).toBeCalledWith('ChangePassword', {
            email: 'test@gmail.com'
        });
    });

    it('login displays error message for 401 status code', async () => {
        mockUnwrap = jest.fn().mockRejectedValue({ status: 401 });
        const signInButton = tree.root.findByProps({ testID: 'signInButton' });
        await act(() => signInButton.props.onPress());
        expect(Toast.show).toBeCalledWith({
            type: 'errorResponse',
            text1: 'Incorrect username or password',
            position: 'bottom'
        });
    });

    it('login displays error message for unknown error', async () => {
        mockUnwrap = jest.fn().mockRejectedValue({ status: 402 });
        const signInButton = tree.root.findByProps({ testID: 'signInButton' });
        await act(() => signInButton.props.onPress());
        expect(Toast.show).toBeCalledWith({
            type: 'errorResponse',
            text1: 'An unknown error has occurred',
            position: 'bottom'
        });
    });
});
