import moment from 'moment';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import LogTimePicker from '@/shared/logTimePicker';

it('logTimePicker snapshot', async () => {
    const selectedValue = new Date(`2023-01-01 12:00:00`);
    const tree = renderer.create(
        <LogTimePicker
            fieldName="Start Time"
            selectedValue={selectedValue}
            locale="en_GB"
        />
    );
    expect(tree).toMatchSnapshot();
});

it('logTimePicker renders without crashing', async () => {
    const selectedValue = new Date(`2023-01-01 12:00:00`);
    const tree = renderer.create(
        <LogTimePicker
            fieldName="Start Time"
            selectedValue={selectedValue}
            locale="en_GB"
        />
    );
    expect(tree.root).toBeTruthy();
});

it('logTimePicker displays the selected time correctly', async () => {
    const selectedValue = new Date(`2023-01-01 12:00:00`);
    const tree = renderer.create(
        <LogTimePicker
            fieldName="Start Time"
            selectedValue={selectedValue}
            locale="en_GB"
        />
    );
    const valueTxt = tree.root.findByProps({
        testID: 'valueTxt'
    }).props;
    expect(valueTxt.children).toEqual(moment(selectedValue).format('HH:mm'));
});

it('logTimePicker calls onSelect callback when time is selected', async () => {
    const selectedValue = new Date(`2023-01-01 12:00:00`);
    const onSelect = jest.fn();

    const tree = renderer.create(
        <LogTimePicker
            fieldName="Start Time"
            selectedValue={selectedValue}
            onSelect={onSelect}
            locale="en_GB"
        />
    );

    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());

    const saveBtn = tree.root.findByProps({
        testID: 'saveBtn'
    }).props;
    await act(() => saveBtn.onPress());

    expect(onSelect).toHaveBeenCalledTimes(1);
});

it('logTimePicker displays custom title when provided', async () => {
    const selectedValue = new Date(`2023-01-01 12:00:00`);
    const customTitle = '12:00:00';

    const tree = renderer.create(
        <LogTimePicker
            fieldName="Start Time"
            selectedValue={selectedValue}
            customTitle={customTitle}
            locale="en_GB"
        />
    );
    const valueTxt = tree.root.findByProps({
        testID: 'valueTxt'
    }).props;
    expect(valueTxt.children).toEqual(customTitle);
});

it('logTimePicker disables interaction when disabled prop is set', async () => {
    const selectedValue = new Date(`2023-01-01 12:00:00`);
    const disabled = true;

    const tree = renderer.create(
        <LogTimePicker
            fieldName="Start Time"
            selectedValue={selectedValue}
            locale="en_GB"
            disabled={disabled}
        />
    );

    // Open time picker
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());

    let timerPickerContainer;
    try {
        timerPickerContainer = tree.root.findByProps({
            testID: 'timerPickerContainer'
        });
    } catch (error) {}
    expect(timerPickerContainer).toBeUndefined();
});
