import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogActivity from '@/pages/logActivity';
import logReducer from '@/reducers/log';

const rootReducer = combineReducers({
    log: logReducer
});

const store = configureStore({
    reducer: rootReducer
});

let root;
describe('LogActivity', () => {
    beforeEach(() => {
        root = renderer.create(
            <NavigationContainer>
                <Provider store={store}>
                    <LogActivity />
                </Provider>
            </NavigationContainer>
        ).root;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('log activity zero value', async () => {
        let input = root.findByProps({
            title: 'How long was your exercise?'
        }).props;
        await act(() => input.onChangeHandler(0));

        const submitButton = root.findByProps({ testID: 'submitButton' });
        await act(() => submitButton.props.onPress());

        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'The exercise duration should be greater than 0',
            type: 'errorResponse'
        });
    });
    it('log activity negative value', async () => {
        let input = root.findByProps({
            title: 'How long was your exercise?'
        }).props;
        await act(() => input.onChangeHandler(-1));

        const submitButton = root.findByProps({ testID: 'submitButton' });
        await act(() => submitButton.props.onPress());

        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'The exercise duration should be greater than 0',
            type: 'errorResponse'
        });
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
    it('log activity submit', async () => {
        const durationSelector = root.findByProps({
            title: 'How long was your exercise?'
        }).props;
        await act(() => durationSelector.onDecrementHandler());
        await act(() => durationSelector.onIncrementHandler());
        await act(() => durationSelector.onChangeHandler(200));

        const startTimeSelector = root.findByProps({
            fieldName: 'Start Time'
        }).props;
        await act(() =>
            startTimeSelector.onSelect(moment().subtract(1, 'hour'))
        );

        let dateInput = root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

        const selectActivity = root.findByProps({
            fieldName: 'Select Activity'
        }).props;
        await act(() => selectActivity.onSelect({ id: 1, name: 'activity' }));

        const selectIntensity = root.findByProps({
            fieldName: 'Intensity'
        }).props;
        await act(() => selectIntensity.onSelect({ id: 1, name: 'intensity' }));

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
    it('log activity delete', async () => {
        let deleteDialog = root.findByProps({
            confirmBtnTitle: 'Delete'
        }).props;
        await act(() => deleteDialog.onConfirmBtnHandler());
        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'User Exercise deleted successfully.',
            type: 'successResponse'
        });
    });
    it('log activity should update successfully', async () => {
        const durationSelector = root.findByProps({
            title: 'How long was your exercise?'
        }).props;
        await act(() => durationSelector.onDecrementHandler());
        await act(() => durationSelector.onIncrementHandler());
        await act(() => durationSelector.onChangeHandler(200));

        const startTimeSelector = root.findByProps({
            fieldName: 'Start Time'
        }).props;
        await act(() =>
            startTimeSelector.onSelect(moment().subtract(2, 'hour'))
        );

        let dateInput = root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().subtract(2, 'days')));

        const selectActivity = root.findByProps({
            fieldName: 'Select Activity'
        }).props;
        await act(() => selectActivity.onSelect({ id: 1, name: 'activity' }));

        const selectIntensity = root.findByProps({
            fieldName: 'Intensity'
        }).props;
        await act(() => selectIntensity.onSelect({ id: 1, name: 'intensity' }));

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
