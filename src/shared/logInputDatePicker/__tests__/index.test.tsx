import moment from 'moment';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import LogInputDatePicker from '@/shared/logInputDatePicker';

function checkIfCalendarIsClosed(tree: renderer.ReactTestRenderer) {
    let calendarContainer;
    try {
        calendarContainer = tree.root.findByProps({
            testID: 'calendarContainer'
        });
    } catch (error) {}
    expect(calendarContainer).toBeUndefined();
}

it('logInputDatePicker snapshot', async () => {
    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={'2023-01-01'}
            onDateSelected={(_: Date) => _}
        />
    );
    expect(tree).toMatchSnapshot();
});

it('logInputDatePicker renders without crashing', async () => {
    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={moment().format('YYYY-MM-DD')}
            onDateSelected={(_: Date) => _}
        />
    );
    expect(tree.root).toBeTruthy();
});

it('logInputDatePicker calendar is initially hidden', async () => {
    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={moment().format('YYYY-MM-DD')}
            onDateSelected={(_: Date) => _}
        />
    );

    checkIfCalendarIsClosed(tree);
});

it('logInputDatePicker clicking LogInput opens the calendar', async () => {
    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={moment().format('YYYY-MM-DD')}
            onDateSelected={(_: Date) => _}
        />
    );
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());

    const calendarContainer = tree.root.findByProps({
        testID: 'calendarContainer'
    }).props;

    expect(calendarContainer).toBeTruthy();
});

it('logInputDatePicker clicking Today button updates the selected date', async () => {
    const selectedDate = moment().format('YYYY-MM-DD');
    const onDateSelected = jest.fn().mockImplementation((date: Date) => {
        expect(moment(date).format('YYYY-MM-DD')).toEqual(selectedDate);
    });

    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={selectedDate}
            onDateSelected={onDateSelected}
        />
    );
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());

    const todayButton = tree.root.findByProps({
        testID: 'todayButton'
    }).props;
    await act(() => todayButton.onPress());
    expect(onDateSelected).toHaveBeenCalledTimes(1);
});

it('logInputDatePicker selecting a date closes the calendar and updates the selected date', async () => {
    const selectedDateString = '2023-01-01';
    const onDateSelected = jest.fn().mockImplementation((date: Date) => {
        expect(moment(date).format('YYYY-MM-DD')).toEqual(selectedDateString);
    });

    const onCalendarSheetClosed = jest.fn();

    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={moment().format('YYYY-MM-DD')}
            onDateSelected={onDateSelected}
            onCalendarClosed={onCalendarSheetClosed}
        />
    );
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());

    const calendar = tree.root.findByProps({
        testID: 'calendar'
    }).props;
    await act(() => calendar.onDayPress({ dateString: selectedDateString }));
    expect(onDateSelected).toHaveBeenCalledTimes(1);
    expect(onCalendarSheetClosed).toHaveBeenCalledTimes(1);
});

it('logInputDatePicker initializes with correct initial state', async () => {
    const initialSelectedDate = moment().format('YYYY-MM-DD');
    const disabled = true;
    const minDate = moment().subtract(1, 'year').format('YYYY-MM-DD');

    const tree = renderer.create(
        <LogInputDatePicker
            selectedDate={initialSelectedDate}
            disabled={disabled}
            minDate={minDate}
            onDateSelected={(_: Date) => _}
        />
    );

    // Open calendar
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());

    if (!disabled) {
        const calendar = tree.root.findByProps({
            testID: 'calendar'
        }).props;

        expect(calendar.minDate).toBe(minDate);
        expect(calendar.current).toBe(initialSelectedDate);
    } else {
        // check if calendar is still closed after clicking LogInput when disabled
        checkIfCalendarIsClosed(tree);
    }
});
