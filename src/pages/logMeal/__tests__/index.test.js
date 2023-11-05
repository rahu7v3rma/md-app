import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogMeal from '@/pages/logMeal';
import imageMock from '@/pages/logMeal/__mocks__/image.json';
import logReducer from '@/reducers/log';
import * as imageServices from '@/services/image';

const rootReducer = combineReducers({
    log: logReducer
});

const store = configureStore({
    reducer: rootReducer
});

let root;
describe('LogMeal', () => {
    beforeEach(() => {
        root = renderer.create(
            <NavigationContainer>
                <Provider store={store}>
                    <LogMeal />
                </Provider>
            </NavigationContainer>
        ).root;
        jest.spyOn(imageServices, 'pickImage').mockResolvedValue(imageMock);
        jest.spyOn(imageServices, 'uploadImage').mockResolvedValue(
            'validUploadedImagePath'
        );
        jest.mock('react-native-toast-message', () => ({
            show: jest.fn(),
            hide: jest.fn()
        }));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('image upload choose photo', async () => {
        const imagePickerButton = root.findByProps({
            testID: 'imagePickerButton'
        });
        await act(() => imagePickerButton.props.onPress());

        const choosePhotoButton = root.findByProps({
            testID: 'choosePhoto'
        });
        await act(() => choosePhotoButton.props.onPress());

        const submitButton = root.findByProps({ testID: 'submitButton' });
        await act(() => submitButton.props.onPress());

        expect(imageServices.uploadImage).toBeCalledWith(
            imageMock.data,
            imageMock.mime,
            'user1',
            false
        );
    });
    it('image upload take photo', async () => {
        const imagePickerButton = root.findByProps({
            testID: 'imagePickerButton'
        });
        await act(() => imagePickerButton.props.onPress());

        const takePhotoButton = root.findByProps({
            testID: 'takePhoto'
        });
        await act(() => takePhotoButton.props.onPress());

        const submitButton = root.findByProps({ testID: 'submitButton' });
        await act(() => submitButton.props.onPress());

        expect(imageServices.uploadImage).toBeCalledWith(
            imageMock.data,
            imageMock.mime,
            'user1',
            false
        );
    });
    it('log time in future', async () => {
        let dateInput = root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().add(7, 'days')));

        const submitButton = root.findByProps({ testID: 'submitButton' });
        await act(() => submitButton.props.onPress());

        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'You can not select future time.',
            type: 'errorResponse'
        });
    });
    it('log meal submit', async () => {
        const imagePickerButton = root.findByProps({
            testID: 'imagePickerButton'
        });
        await act(() => imagePickerButton.props.onPress());

        const choosePhotoButton = root.findByProps({
            testID: 'choosePhoto'
        });
        await act(() => choosePhotoButton.props.onPress());

        const startTimeSelector = root.findByProps({
            fieldName: 'Time'
        }).props;
        await act(() =>
            startTimeSelector.onSelect(moment().subtract(1, 'hour'))
        );

        let dateInput = root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

        const submitButton = root.findByProps({
            testID: 'submitButton'
        }).props;
        await act(() => submitButton.onPress());

        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'log updated successfully',
            type: 'successResponse'
        });
    });

    it('log meal delete', async () => {
        let deleteDialog = root.findByProps({
            confirmBtnTitle: 'Delete'
        }).props;
        await act(() => deleteDialog.onConfirmBtnHandler());
        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'User logged meal deleted successfully.',
            type: 'successResponse'
        });
    });
    it('log meal shoud update successfully', async () => {
        const imagePickerButton = root.findByProps({
            testID: 'imagePickerButton'
        });
        await act(() => imagePickerButton.props.onPress());

        const choosePhotoButton = root.findByProps({
            testID: 'choosePhoto'
        });
        await act(() => choosePhotoButton.props.onPress());

        const startTimeSelector = root.findByProps({
            fieldName: 'Time'
        }).props;
        await act(() =>
            startTimeSelector.onSelect(moment().subtract(1, 'hour'))
        );

        let dateInput = root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

        const submitButton = root.findByProps({
            testID: 'submitButton'
        }).props;
        await act(() => submitButton.onPress());

        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'log updated successfully',
            type: 'successResponse'
        });
    });
});
