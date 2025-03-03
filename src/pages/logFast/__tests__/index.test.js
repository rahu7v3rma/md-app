import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogFast from '@/pages/logFast';
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

it('log fast zero value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogFast />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;

    let input = tree.root.findByProps({
        title: 'Tell us about your fast'
    }).props;
    await act(() => input.onChangeHandler(0));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'The logged time should be greater than 0',
        type: 'errorResponse'
    });
});

it('log fast negative value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogFast />
        </Provider>
    );

    jest.runAllTimers();

    let input = tree.root.findByProps({
        title: 'Tell us about your fast'
    }).props;
    await act(() => input.onChangeHandler(-1));
    expect(input.value).toBeGreaterThan(0);
});

it('log fast time in the future', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogFast />
        </Provider>
    );

    const mockShow = jest.fn();
    Toast.show = mockShow;
    let input = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => input.onDateSelected(moment().add(7, 'days')));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    jest.mock('react-native-toast-message/lib/src/Toast', () => ({
        ...jest.requireActual('react-native-toast-message/lib/src/Toast'),
        mockShow: mockShow
    }));
    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'You can not select future time.',
        type: 'errorResponse'
    });
});

it('log fast submit', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogFast />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;
    const fastDurationSelector = tree.root.findByProps({
        title: 'Tell us about your fast'
    }).props;
    await act(() => fastDurationSelector.onDecrementHandler());
    await act(() => fastDurationSelector.onIncrementHandler());
    await act(() => fastDurationSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => startTimeSelector.onSelect(moment().subtract(1, 'hour')));

    let dateInput = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

    const submitButton = tree.root.findByProps({
        testID: 'submitButton'
    }).props;
    await act(() => submitButton.onPress());

    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'Logged Successfully',
        type: 'successResponse'
    });
});

it('log fast delete', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogFast />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;
    let deleteDialog = tree.root.findByProps({
        confirmBtnTitle: 'Delete'
    }).props;
    await act(() => deleteDialog.onConfirmBtnHandler());
    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'User fast log deleted successfully',
        type: 'successResponse'
    });
});
it('log fast should be update successfully', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogFast />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;

    const fastDurationSelector = tree.root.findByProps({
        title: 'Tell us about your fast'
    }).props;
    await act(() => fastDurationSelector.onDecrementHandler());
    await act(() => fastDurationSelector.onIncrementHandler());
    await act(() => fastDurationSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => startTimeSelector.onSelect(moment().subtract(1, 'hour')));

    let dateInput = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

    const submitButton = tree.root.findByProps({
        testID: 'submitButton'
    }).props;
    await act(() => submitButton.onPress());

    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'Logged Successfully',
        type: 'successResponse'
    });
});
