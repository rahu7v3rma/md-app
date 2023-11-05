import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogWeight from '@/pages/logWeight';
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
    jest.restoreAllMocks();
});

it('log weight zero value', async () => {
    const tree = await act(() =>
        renderer.create(
            <Provider store={store}>
                <LogWeight />
            </Provider>
        )
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'How much do you weigh?'
    }).props;
    await act(() => input.onChangeHandler(0));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'log updated successfully',
        type: 'successResponse'
    });
});

it('log weight negative value', async () => {
    const tree = await act(() =>
        renderer.create(
            <Provider store={store}>
                <LogWeight />
            </Provider>
        )
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'How much do you weigh?'
    }).props;
    await act(() => input.onChangeHandler(-1));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'log updated successfully',
        type: 'successResponse'
    });
});

it('log weight time in the future', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogWeight />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let inputWeight = tree.root.findByProps({
        title: 'How much do you weigh?'
    }).props;
    await act(() => inputWeight.onChangeHandler(12));
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

it('log weight submit', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogWeight />
        </Provider>
    );

    const weightSelector = tree.root.findByProps({
        title: 'How much do you weigh?'
    }).props;
    await act(() => weightSelector.onDecrementHandler());
    await act(() => weightSelector.onIncrementHandler());
    await act(() => weightSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => startTimeSelector.onSelect(moment().subtract(1, 'hour')));

    let input = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => input.onDateSelected(moment().subtract(1, 'days')));

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

it('log weight delete', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogWeight />
        </Provider>
    );
    let deleteDialog = tree.root.findByProps({
        confirmBtnTitle: 'Delete'
    }).props;
    await act(() => deleteDialog.onConfirmBtnHandler());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'User weight log deleted successfully.',
        type: 'successResponse'
    });
});
it('log weight shoud update successfully', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogWeight />
        </Provider>
    );

    const weightSelector = tree.root.findByProps({
        title: 'How much do you weigh?'
    }).props;
    await act(() => weightSelector.onDecrementHandler());
    await act(() => weightSelector.onIncrementHandler());
    await act(() => weightSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Time'
    }).props;
    await act(() => startTimeSelector.onSelect(moment().subtract(2, 'hour')));

    let input = tree.root.findByProps({
        selectedDate: moment().format('YYYY-MM-DD')
    }).props;
    await act(() => input.onDateSelected(moment().subtract(2, 'days')));

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
