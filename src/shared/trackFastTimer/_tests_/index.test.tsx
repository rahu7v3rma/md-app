import { NavigationContainer } from '@react-navigation/native';
import { configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import trackReducer, { TrackSelectors } from '@/reducers/track';
import TrackFastTimer from '@/shared/trackFastTimer';

const store = configureStore({
    reducer: trackReducer
});
jest.mock('@/reducers/track', () => ({
    TrackSelectors: jest.fn().mockImplementation(() => ({
        trackFastState: 'tracking',
        trackStartedAt: '2023-01-01 12:00:00',
        trackTimeLimitInSeconds: 57600,
        trackedTimeInSeconds: 1000
    }))
}));

it('trackFastTimer Snapshot Testing with Jest', async () => {
    const tree = renderer.create(
        <NavigationContainer>
            <Provider store={store}>
                <TrackFastTimer />
            </Provider>
        </NavigationContainer>
    );
    expect(tree).toMatchSnapshot();
});

it('trackFastTimer renders without crashing', async () => {
    const tree = renderer.create(<TrackFastTimer />);
    expect(tree.root).toBeTruthy();
});

it('trackFastTimer should call the onPress function when the component is pressed', async () => {
    const onTrackFastTimer = jest.fn();
    const tree = renderer.create(<TrackFastTimer onPress={onTrackFastTimer} />);
    const trackFastTimerButton = tree.root.findByProps({
        testID: 'trackFastTimerButton'
    }).props;
    await act(() => trackFastTimerButton.onPress());
    expect(onTrackFastTimer).toHaveBeenCalledTimes(1);
});

it('trackFastTimer should display the correct time text', async () => {
    const { trackTimeLimitInSeconds, trackStartedAt, trackedTimeInSeconds } =
        TrackSelectors();

    const tree = renderer.create(
        <Provider store={store}>
            <TrackFastTimer />
        </Provider>
    );

    const date = moment(trackStartedAt || undefined).format('YYYY-MM-DD');
    const formatTime = (timeInSeconds: number) => {
        return moment(date)
            .startOf('day')
            .seconds(timeInSeconds || 0)
            .format('H:mm:ss');
    };

    const trackFastTimeText = tree.root.findByProps({
        testID: 'trackFastTimeText'
    }).props;

    expect(trackFastTimeText.children).toBe(
        formatTime(trackTimeLimitInSeconds - trackedTimeInSeconds)
    );
});

it('trackFastTimer should display the ClockIcon when trackFastState is not empty', async () => {
    const tree = renderer.create(
        <Provider store={store}>
            <TrackFastTimer />
        </Provider>
    );

    let trackState;
    try {
        trackState = tree.root.findByProps({
            testID: 'trackState'
        }).props;
    } catch (error) {}
    expect(trackState).toBeTruthy();
});
