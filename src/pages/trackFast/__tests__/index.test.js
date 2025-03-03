import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import TrackFast from '@/pages/trackFast';
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

it('start fast tracker from time in the future', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <TrackFast
                startTrackFastTimerInterval={() => jest.fn()}
                stopTrackFastTimerInterval={() => jest.fn()}
                trackFastTimerListener={() => jest.fn()}
                setTrackFastTimerListener={() => jest.fn()}
            />
        </Provider>
    );

    jest.runAllTimers();

    Toast.show = jest.fn().mockReturnValue(Promise.resolve());
    let input = tree.root.findAllByProps({ disabled: false })[1].props;
    await act(() => input.onDateSelected(moment().add(7, 'days')));
    let button = tree.root.findAllByProps({ bordered: false })[1].props;
    await act(() => button.onPress());
    expect(Toast.show).toBeCalledWith({
        position: 'bottom',
        text1: 'You can not select future time.',
        type: 'errorResponse'
    });
});

it('start tracking', async () => {
    jest.mock('@/reducers/track', () => ({
        TrackSelectors: jest.fn().mockImplementation(() => ({
            trackFastState: 'tracking',
            trackStartedAt: '',
            trackTimeLimitInSeconds: 57600,
            trackedTimeInSeconds: 0
        })),
        trackStart: jest.fn(),
        trackUpdate: jest.fn()
    }));

    const tree = renderer.create(
        <Provider store={store}>
            <TrackFast
                startTrackFastTimerInterval={() => jest.fn()}
                stopTrackFastTimerInterval={() => jest.fn()}
                trackFastTimerListener={() => jest.fn()}
                setTrackFastTimerListener={() => jest.fn()}
            />
        </Provider>
    );

    jest.runAllTimers();
    let input = tree.root.findAllByProps({ disabled: true });
    expect(input.length).toEqual(2);
});

it('set default values for tracking timer and date', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <TrackFast
                startTrackFastTimerInterval={() => jest.fn()}
                stopTrackFastTimerInterval={() => jest.fn()}
                trackFastTimerListener={() => jest.fn()}
                setTrackFastTimerListener={() => jest.fn()}
            />
        </Provider>
    );

    jest.runAllTimers();
    let texts = tree.root.findAllByProps({ adjustsFontSizeToFit: true });
    expect(texts[3].props.children).toEqual('16:00:00');
    expect(texts[7].props.children).toEqual(moment().format('HH:mm'));
    expect(texts[11].props.children).toEqual(moment().format('DD MMM YYYY'));
});
