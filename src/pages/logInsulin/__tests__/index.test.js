import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogInsulin from '@/pages/logInsulin';
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

it('log Insulin zero value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'How much insulin did you inject?'
    }).props;
    act(() => input.onChangeHandler(0));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'The log value should be greater than 0',
        type: 'errorResponse'
    });
});

it('log Insulin negative value', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;
    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findByProps({
        title: 'How much insulin did you inject?'
    }).props;
    act(() => input.onChangeHandler(-1));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    act(() => button.onPress());
    jest.mock('react-native-toast-message/lib/src/Toast', () => ({
        ...jest.requireActual('react-native-toast-message/lib/src/Toast'),
        mockShow: mockShow
    }));
    setTimeout(() => {
        expect(mockShow).toBeCalledWith({
            position: 'bottom',
            text1: 'The log value should be greater than 0',
            type: 'errorResponse'
        });
    }, 300);
});

it('log Insulin empty type', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );

    const mockShow = jest.fn();
    Toast.show = mockShow;

    let input = tree.root.findByProps({
        title: 'How much insulin did you inject?'
    }).props;

    // Simulate user interaction to change the input value (e.g., set insulin value)
    await act(async () => {
        input.onChangeHandler(42);
    });

    // Simulate user interaction to submit without selecting a type
    const button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(async () => {
        button.onPress();
    });

    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'Please select Type.',
        type: 'errorResponse'
    });
});

it('log Insulin time in the future', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );

    const mockShow = jest.fn();
    Toast.show = mockShow;

    const selectedDate = moment().format('YYYY-MM-DD');
    const futureDate = moment().add(7, 'days');

    const dateInput = tree.root.findByProps({
        selectedDate: selectedDate
    }).props;

    // Simulate user interaction to set a future date
    await act(async () => {
        dateInput.onDateSelected(futureDate);
    });

    const button = tree.root.findAllByProps({ bordered: false })[1].props;

    // Simulate user interaction to submit
    await act(async () => {
        button.onPress();
    });

    expect(mockShow).toBeCalledWith({
        position: 'bottom',
        text1: 'You can not select future time.',
        type: 'errorResponse'
    });
});

it('log insulin submit', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;

    const fastDurationSelector = tree.root.findByProps({
        title: 'How much insulin did you inject?'
    }).props;
    await act(() => fastDurationSelector.onDecrementHandler());
    await act(() => fastDurationSelector.onIncrementHandler());
    await act(() => fastDurationSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Start Time'
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
    jest.mock('react-native-toast-message/lib/src/Toast', () => ({
        ...jest.requireActual('react-native-toast-message/lib/src/Toast'),
        mockShow: mockShow
    }));
    mockShow.mockClear();
    setTimeout(() => {
        expect(mockShow).toBeCalledWith({
            position: 'bottom',
            text1: 'Logged Successfully',
            type: 'successResponse'
        });
    }, 300);
});

it('log insulin should be update successfully', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );
    const mockShow = jest.fn();
    Toast.show = mockShow;
    const fastDurationSelector = tree.root.findByProps({
        title: 'How much insulin did you inject?'
    }).props;
    await act(() => fastDurationSelector.onDecrementHandler());
    await act(() => fastDurationSelector.onIncrementHandler());
    await act(() => fastDurationSelector.onChangeHandler(200));

    const startTimeSelector = tree.root.findByProps({
        fieldName: 'Start Time'
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
    jest.mock('react-native-toast-message/lib/src/Toast', () => ({
        ...jest.requireActual('react-native-toast-message/lib/src/Toast'),
        mockShow: mockShow
    }));
    mockShow.mockClear();
    setTimeout(() => {
        expect(mockShow).toBeCalledWith({
            position: 'bottom',
            text1: 'log updated successfully',
            type: 'successResponse'
        });
    }, 300);
});

it('log Insulin delete', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <LogInsulin />
        </Provider>
    );
    let deleteDialog = tree.root.findByProps({
        confirmBtnTitle: 'Delete'
    }).props;
    await act(() => deleteDialog.onConfirmBtnHandler());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'Log deleted successfully!',
        type: 'successResponse'
    });
});
