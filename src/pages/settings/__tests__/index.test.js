import React from 'react';
import 'react-native';
import { resetGenericPassword } from 'react-native-keychain';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
import { PersistGate } from 'redux-persist/integration/react';

import { navigationRef } from '@/navigation';
import store, { persistor } from '@/store';

import AppSettings from '../../../pages/settings';
import { userLogin } from '../../../reducers/user';

jest.unmock('@/reducers/user');

jest.unmock('@/services/api');
jest.mock('@/services/api', () => ({
    login: jest.fn().mockReturnValue({
        email: 'user1@example.example',
        first_name: 'Some',
        last_name: 'Name',
        username: 'user1'
    })
}));

jest.mock('@/navigation', () => ({
    navigationRef: {
        dispatch: jest.fn()
    }
}));

jest.mock('react-native-keychain', () => {
    return {
        setGenericPassword: jest.fn(() => {}),
        getGenericPassword: jest.fn(() => {}),
        resetGenericPassword: jest.fn(() => {})
    };
});

it('logout a user', async () => {
    expect(store.getState().user.userInfo).toBeNull();
    await store.dispatch(
        userLogin({ email: 'test@test.com', password: 'test_pass' })
    );
    expect(store.getState().user.userInfo).not.toBeNull();
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <AppSettings />
            </Provider>
        </PersistGate>
    );
    let element = tree.root.findByProps({ testID: 'logout' }).props;
    expect(resetGenericPassword).not.toBeCalled();
    expect(navigationRef.dispatch).not.toBeCalled();
    act(() => element.onPress());
    expect(resetGenericPassword).toBeCalled();
    expect(navigationRef.dispatch).toBeCalledWith({
        type: 'RESET',
        payload: { index: 0, routes: [{ name: 'SignIn' }] }
    });
    expect(store.getState().user.userInfo).toBeNull();
});
