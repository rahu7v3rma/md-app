import React from 'react';
import renderer, { act } from 'react-test-renderer';

import LogUnitPicker from '@/shared/logUnitPicker';

it('logunitpicker snapshot', async () => {
    const tree = renderer.create(<LogUnitPicker value={1} />);
    expect(tree).toMatchSnapshot();
});

it('logunitpicker renders without crashing', async () => {
    const tree = renderer.create(<LogUnitPicker value={1} />);
    expect(tree.root).toBeTruthy();
});

it('displays the unit value correctly', async () => {
    const tree = renderer.create(
        <LogUnitPicker value={1} valueTextTestID={'valueTextTestID'} />
    );
    const valueTextTestID = tree.root.findByProps({
        testID: 'valueTextTestID'
    }).props;
    expect(valueTextTestID.children).toBe(1);
});

it('calls onIncrementHandler when the plus button is pressed', async () => {
    const onIncrementHandler = jest.fn();
    const tree = renderer.create(
        <LogUnitPicker
            value={1}
            onIncrementHandler={onIncrementHandler}
            plusButtonTestID={'plusButtonnTestID'}
        />
    );
    const plusButton = tree.root.findByProps({
        testID: 'plusButtonnTestID'
    }).props;
    await act(() => plusButton.onPress());
    expect(onIncrementHandler).toHaveBeenCalledTimes(1);
});

it('calls onDecrementHandler when the minus button is pressed', async () => {
    const onDecrementHandler = jest.fn();
    const tree = renderer.create(
        <LogUnitPicker
            value={1}
            onDecrementHandler={onDecrementHandler}
            minusButtonTestID={'minusButtonTestID'}
        />
    );
    const minusButton = tree.root.findByProps({
        testID: 'minusButtonTestID'
    }).props;
    await act(() => minusButton.onPress());
    expect(onDecrementHandler).toHaveBeenCalledTimes(1);
});

it('calls onChangeHandler when the unit value is edited', async () => {
    const onChangeHandler = jest.fn();
    const tree = renderer.create(
        <LogUnitPicker
            value={1}
            onChangeHandler={onChangeHandler}
            touchValueTestID={'touchValueTestID'}
            textInputTestID={'textInputTestID'}
        />
    );
    // make input editable first
    const touchValue = tree.root.findByProps({
        testID: 'touchValueTestID'
    }).props;
    await act(() => touchValue.onPress());

    // now we can edit value
    const textInput = tree.root.findByProps({
        testID: 'textInputTestID'
    }).props;
    await act(() => textInput.onChangeText('12'));
    expect(onChangeHandler).toHaveBeenCalledWith(12);
});

it('displays the timer value correctly', async () => {
    const tree = renderer.create(
        <LogUnitPicker
            value={90}
            type={'timer'}
            hourTextTestID={'hourTextTestID'}
            minTextTestID={'minTextTestID'}
        />
    );
    // call useEffect method
    await act(async () => {
        renderer.create(
            <LogUnitPicker
                value={90}
                type={'timer'}
                hourTextTestID={'hourTextTestID'}
                minTextTestID={'minTextTestID'}
            />
        );
    });
    const hourText = tree.root.findByProps({
        testID: 'hourTextTestID'
    }).props;
    expect(hourText.children).toBe('1');
    const minTex = tree.root.findByProps({
        testID: 'minTextTestID'
    }).props;
    expect(minTex.children).toBe('30');
});

it('opens the timer picker modal when timer is pressed', async () => {
    const tree = renderer.create(
        <LogUnitPicker
            value={1}
            type={'timer'}
            timerTouchTestID={'timerTouchTestID'}
            timePicModalTestID={'timePicModalTestID'}
        />
    );
    // clickon timer to open modal
    const timerTouch = tree.root.findByProps({
        testID: 'timerTouchTestID'
    }).props;
    await act(() => timerTouch.onPress());

    // check modal is visible or not
    const timePicModal = tree.root.findByProps({
        testID: 'timePicModalTestID'
    }).props;
    expect(timePicModal).toBeTruthy();
});
