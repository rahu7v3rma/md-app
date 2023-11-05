import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogMedication from '@/pages/logMedication';
import logReducer from '@/reducers/log';

const rootReducer = combineReducers({
    log: logReducer
});

const store = configureStore({
    reducer: rootReducer
});

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

it('log Medication zero value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );
    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'What medication did you take?'
    }).props;
    await act(() => input.onChangeHandler(0));
    input = tree.root.findByProps({
        title: 'What medication did you take?'
    }).props;
    expect(input.value).toBeGreaterThan(0);
});

it('log Medication negative value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'What medication did you take?'
    }).props;
    await act(() => input.onChangeHandler(-1));
    input = tree.root.findByProps({
        title: 'What medication did you take?'
    }).props;
    expect(input.value).toBeGreaterThan(0);
});

it('log Medication time in the future', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => input.onDateSelected(moment().add(7, 'days')));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'You can not select future time.',
        type: 'errorResponse'
    });
});

it('log Medication empty medication', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'Please select a medication!',
        type: 'errorResponse'
    });
});

it('log Medication empty dose', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );

    jest.runAllTimers();

    let input = tree.root.findByProps({
        fieldName: 'Select Your Medication'
    }).props;

    await act(() => input.onSelect({ id: '1', name: 'drug1' }));

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'Please select a Dose!',
        type: 'errorResponse'
    });
});

it('log Medication submit', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );

    const medicationSelector = tree.root.findByProps({
        title: 'What medication did you take?'
    }).props;
    await act(() => medicationSelector.onDecrementHandler());
    await act(() => medicationSelector.onIncrementHandler());
    await act(() => medicationSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => startTimeSelector.onSelect(moment().subtract(1, 'hour')));

    let dateInput = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

    const selectType = tree.root.findByProps({
        fieldName: 'Select Your Medication'
    }).props;
    await act(() => selectType.onSelect({ id: 1, name: 'Type' }));

    const selectDose = tree.root.findByProps({
        fieldName: 'Select Your Dose'
    }).props;
    await act(() => selectDose.onSelect({ id: 1, name: 'Dose' }));

    const submitButton = tree.root.findByProps({
        testID: 'submitButton'
    }).props;
    await act(() => submitButton.onPress());

    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'log updated successfully',
        type: 'successResponse'
    });
});

it('log Medication delete', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );
    let deleteDialog = tree.root.findByProps({
        confirmBtnTitle: 'Delete'
    }).props;
    await act(() => deleteDialog.onConfirmBtnHandler());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'User Medication log deleted successfully',
        type: 'successResponse'
    });
});

it('log Medication shouldupdate successfully', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogMedication />
        </Provider>
    );

    const medicationSelector = tree.root.findByProps({
        title: 'What medication did you take?'
    }).props;
    await act(() => medicationSelector.onDecrementHandler());
    await act(() => medicationSelector.onIncrementHandler());
    await act(() => medicationSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => startTimeSelector.onSelect(moment().subtract(2, 'hour')));

    let dateInput = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => dateInput.onDateSelected(moment().subtract(2, 'days')));

    const selectType = tree.root.findByProps({
        fieldName: 'Select Your Medication'
    }).props;
    await act(() => selectType.onSelect({ id: 1, name: 'Type' }));

    const selectDose = tree.root.findByProps({
        fieldName: 'Select Your Dose'
    }).props;
    await act(() => selectDose.onSelect({ id: 1, name: 'Dose' }));

    const submitButton = tree.root.findByProps({
        testID: 'submitButton'
    }).props;
    await act(() => submitButton.onPress());

    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'log updated successfully',
        type: 'successResponse'
    });
});
