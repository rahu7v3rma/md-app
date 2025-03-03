import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import LogWaterIntake from '@/pages/logWaterIntake';
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

describe('LogWaterIntakePage', () => {
    it('log Water zero value', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
            </Provider>
        );

        Toast.show = jest.fn().mockReturnValue(Promise.resolve());
        let input = tree.root.findByProps({
            title: 'How much water did you drink?'
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

    it('log Water negative value', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
            </Provider>
        );

        jest.runAllTimers();

        Toast.show = jest.fn().mockReturnValue(Promise.resolve());
        let input = tree.root.findByProps({
            title: 'How much water did you drink?'
        }).props;
        await act(() => input.onChangeHandler(-1));
        let button = tree.root.findAllByProps({ bordered: false })[1].props;
        await act(() => button.onPress());
        setTimeout(() => {
            expect(Toast.show).toBeCalledWith({
                position: 'bottom',
                text1: 'The log value should be greater than 0',
                type: 'errorResponse'
            });
        }, 3000);
    });

    it('log Water time in the future', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
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

    it('log Water empty type', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
            </Provider>
        );

        jest.runAllTimers();

        Toast.show = jest.fn().mockReturnValue(Promise.resolve());
        let button = tree.root.findAllByProps({ bordered: false })[1].props;
        await act(() => button.onPress());
        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'Please select Unit!',
            type: 'errorResponse'
        });
    });

    it('log Water submit', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
            </Provider>
        );
        const mockShow = jest.fn();
        Toast.show = mockShow;
        const waterDrinkSelector = tree.root.findByProps({
            title: 'How much water did you drink?'
        }).props;
        await act(() => waterDrinkSelector.onDecrementHandler());
        await act(() => waterDrinkSelector.onIncrementHandler());
        await act(() => waterDrinkSelector.onChangeHandler(200));

        const startTimeSelector = tree.root.findByProps({
            fieldName: 'Time'
        }).props;
        await act(() =>
            startTimeSelector.onSelect(moment().subtract(1, 'hour'))
        );

        let dateInput = tree.root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().subtract(1, 'days')));

        const selectUnits = tree.root.findByProps({
            fieldName: 'Units'
        }).props;
        await act(() => selectUnits.onSelect({ id: 1, name: 'Units' }));

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

    it('log Water delete', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
            </Provider>
        );
        let deleteDialog = tree.root.findByProps({
            confirmBtnTitle: 'Delete'
        }).props;
        await act(() => deleteDialog.onConfirmBtnHandler());
        expect(Toast.show).toBeCalledWith({
            position: 'bottom',
            text1: 'User Hydration log deleted successfully.',
            type: 'successResponse'
        });
    });
    it('log Water shoud update successfully', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <LogWaterIntake />
            </Provider>
        );

        const waterDrinkSelector = tree.root.findByProps({
            title: 'How much water did you drink?'
        }).props;
        await act(() => waterDrinkSelector.onDecrementHandler());
        await act(() => waterDrinkSelector.onIncrementHandler());
        await act(() => waterDrinkSelector.onChangeHandler(200));

        const startTimeSelector = tree.root.findByProps({
            fieldName: 'Time'
        }).props;
        await act(() =>
            startTimeSelector.onSelect(moment().subtract(2, 'hour'))
        );

        let dateInput = tree.root.findByProps({
            selectedDate: moment().format('YYYY-MM-DD')
        }).props;
        await act(() => dateInput.onDateSelected(moment().subtract(2, 'days')));

        const selectUnits = tree.root.findByProps({
            fieldName: 'Units'
        }).props;
        await act(() => selectUnits.onSelect({ id: 1, name: 'Units' }));

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
});
