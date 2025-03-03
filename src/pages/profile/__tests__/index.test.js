import React from 'react';
import 'react-native';
import { resetGenericPassword } from 'react-native-keychain';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';
import { PersistGate } from 'redux-persist/integration/react';

import { navigationRef } from '@/navigation';
import store, { persistor } from '@/store';

import { mockNavigate, mockToast } from '../../../jestSetup';
import imageMock from '../../../pages/logMeal/__mocks__/image.json';
import Profile from '../../../pages/profile';
import { userLogin } from '../../../reducers/user';
import * as imageServices from '../../../services/image';

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

jest.spyOn(imageServices, 'pickImage').mockResolvedValue(imageMock);
jest.spyOn(imageServices, 'uploadImage').mockResolvedValue(
    'validUploadedImagePath'
);

it('logout a user', async () => {
    expect(store.getState().user.userInfo).toBeNull();
    await store.dispatch(
        userLogin({ email: 'test@test.com', password: 'test_pass' })
    );
    expect(store.getState().user.userInfo).not.toBeNull();
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <Profile />
            </Provider>
        </PersistGate>
    );
    let element = tree.root.findByProps({ testID: 'logout' }).props;
    expect(resetGenericPassword).not.toBeCalled();
    expect(navigationRef.dispatch).not.toBeCalled();
    await act(() => element.onPress());
    expect(resetGenericPassword).toBeCalled();
    expect(navigationRef.dispatch).toBeCalledWith({
        type: 'RESET',
        payload: { index: 0, routes: [{ name: 'SignIn' }] }
    });
    expect(store.getState().user.userInfo).toBeNull();
});

it('profile snapshot', () => {
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <Profile />
            </Provider>
        </PersistGate>
    );
    expect(tree).toMatchSnapshot();
});

it('user can change password', async () => {
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <Profile />
            </Provider>
        </PersistGate>
    );
    let element = tree.root.findByProps({ testID: 'changepassword' }).props;
    await act(() => element.onPress());
    expect(mockNavigate).toBeCalledWith('ChangePassword', {});
});

it('user can delete account', async () => {
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <Profile />
            </Provider>
        </PersistGate>
    );
    let element = tree.root.findByProps({ testID: 'deleteAccount' }).props;
    await act(() => element.onPress());
    expect(mockNavigate).toBeCalledWith('DeleteAccount');
});

it('user can change profile picture by choose image from storage', async () => {
    await act(async () => {
        expect(store.getState().user.userInfo).toBeNull();
        await store.dispatch(
            userLogin({ email: 'test@test.com', password: 'test_pass' })
        );
        expect(store.getState().user.userInfo).not.toBeNull();
    });
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <Profile />
            </Provider>
        </PersistGate>
    );

    const editProfilePic = tree.root.findByProps({
        testID: 'editProfilePic'
    });
    await act(() => editProfilePic.props.onPress());

    const choosePhotoButton = tree.root.findByProps({
        testID: 'choosePhoto'
    });
    await act(() => choosePhotoButton.props.onPress());
    expect(imageServices.uploadImage).toBeCalledWith(
        imageMock.data,
        imageMock.mime,
        'user1',
        true
    );
});

it('user can change profile picture by take image from camera', async () => {
    const tree = renderer.create(
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <Profile />
            </Provider>
        </PersistGate>
    );

    const editProfilePic = tree.root.findByProps({
        testID: 'editProfilePic'
    });
    await act(() => editProfilePic.props.onPress());

    const takePhotoButton = tree.root.findByProps({
        testID: 'takePhoto'
    });
    await act(() => takePhotoButton.props.onPress());
    expect(imageServices.uploadImage).toBeCalledWith(
        imageMock.data,
        imageMock.mime,
        'user1',
        true
    );
});

describe('test photos permission', () => {
    it('when there is no photos permission then display toast', async () => {
        jest.spyOn(imageServices, 'pickImage').mockRejectedValue({
            message: '',
            code: 'E_NO_LIBRARY_PERMISSION',
            name: 'Error'
        });
        await act(async () => {
            await store.dispatch(
                userLogin({ email: 'test@test.com', password: 'test_pass' })
            );
            expect(store.getState().user.userInfo).not.toBeNull();
        });
        const tree = renderer.create(
            <PersistGate loading={null} persistor={persistor}>
                <Provider store={store}>
                    <Profile />
                </Provider>
            </PersistGate>
        );

        const editProfilePic = tree.root.findByProps({
            testID: 'editProfilePic'
        });
        await act(() => editProfilePic.props.onPress());

        const choosePhotoButton = tree.root.findByProps({
            testID: 'choosePhoto'
        });
        await act(() => choosePhotoButton.props.onPress());
        expect(mockToast).toBeCalledWith({
            type: 'info',
            text1: "To use a photo, go to your phone's settings and allow library access",
            position: 'bottom'
        });
    });
});

describe('test camera permission', () => {
    it('when there is no camera permission then display toast', async () => {
        jest.spyOn(imageServices, 'pickImage').mockRejectedValue({
            message: '',
            code: 'E_NO_CAMERA_PERMISSION',
            name: 'Error'
        });
        await act(async () => {
            await store.dispatch(
                userLogin({ email: 'test@test.com', password: 'test_pass' })
            );
            expect(store.getState().user.userInfo).not.toBeNull();
        });
        const tree = renderer.create(
            <PersistGate loading={null} persistor={persistor}>
                <Provider store={store}>
                    <Profile />
                </Provider>
            </PersistGate>
        );

        const editProfilePic = tree.root.findByProps({
            testID: 'editProfilePic'
        });
        await act(() => editProfilePic.props.onPress());

        const takePhotoButton = tree.root.findByProps({
            testID: 'takePhoto'
        });

        await act(() => takePhotoButton.props.onPress());

        expect(mockToast).toBeCalledWith({
            type: 'info',
            text1: "To take a photo, go to your phone's settings and allow camera access",
            position: 'bottom'
        });
    });
});
