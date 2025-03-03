import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogBlood from '@/pages/logBlood';
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

it('log Blood zero value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
        </Provider>
    );

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'What was your blood glucose level?'
    }).props;
    await act(() => input.onChangeHandler(0));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'The log value should be greater than 0',
        type: 'errorResponse'
    });
});

it('log Blood negative value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'What was your blood glucose level?'
    }).props;
    await act(() => input.onChangeHandler(-1));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'The log value should be greater than 0',
        type: 'errorResponse'
    });
});

it('log Blood time in the furture', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
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

it('log Blood empty type', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'Please select Type.',
        type: 'errorResponse'
    });
});

it('log Blood submit', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
        </Provider>
    );

    const glucoseLeveleSelector = tree.root.findByProps({
        title: 'What was your blood glucose level?'
    }).props;
    await act(() => glucoseLeveleSelector.onDecrementHandler());
    await act(() => glucoseLeveleSelector.onIncrementHandler());
    await act(() => glucoseLeveleSelector.onChangeHandler(200));

    const timeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => timeSelector.onSelect(moment().subtract(1, 'hour')));

    let dateInput = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

    const selectType = tree.root.findByProps({
        fieldName: 'Type'
    }).props;
    await act(() => selectType.onSelect({ id: 1, name: 'Type' }));

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

it('log Blood delete', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
        </Provider>
    );

    let deleteDialog = tree.root.findByProps({
        confirmBtnTitle: 'Delete'
    }).props;
    await act(() => deleteDialog.onConfirmBtnHandler());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'User blood glucose log deleted successfully.',
        type: 'successResponse'
    });
});
it('log Blood should update successfully', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogBlood />
        </Provider>
    );

    const glucoseLeveleSelector = tree.root.findByProps({
        title: 'What was your blood glucose level?'
    }).props;
    await act(() => glucoseLeveleSelector.onDecrementHandler());
    await act(() => glucoseLeveleSelector.onIncrementHandler());
    await act(() => glucoseLeveleSelector.onChangeHandler(200));

    const timeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => timeSelector.onSelect(moment().subtract(1, 'hour')));

    let dateInput = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

    const selectType = tree.root.findByProps({
        fieldName: 'Type'
    }).props;
    await act(() => selectType.onSelect({ id: 1, name: 'Type' }));

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
