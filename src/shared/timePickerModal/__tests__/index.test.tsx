import moment from 'moment';
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import TimePickerModal, {
    TimePickerModalElement
} from '@/shared/timePickerModal';

describe('<TimePickerModal />', () => {
    it('Time picker modal Snapshot Testing with Jest', async () => {
        const ref = React.createRef<TimePickerModalElement>();
        const tree = renderer.create(
            <TimePickerModal
                ref={ref}
                selectedValue={moment('2023-10-01T00:00:00.000Z').toDate()}
            />
        );
        await act(() => ref.current?.openTimePickerModal());

        expect(tree).toMatchSnapshot();
    });

    it('should render without errors', async () => {
        const ref = React.createRef<TimePickerModalElement>();
        const tree = renderer.create(
            <TimePickerModal
                ref={ref}
                selectedValue={moment('2023-10-01T00:00:00.000Z').toDate()}
            />
        );
        await act(() => ref.current?.openTimePickerModal());

        expect(tree.root).toBeTruthy();
    });

    it('should open the modal using the ref', async () => {
        const ref = React.createRef<TimePickerModalElement>();
        const tree = renderer.create(
            <TimePickerModal
                ref={ref}
                selectedValue={moment('2023-10-01T00:00:00.000Z').toDate()}
            />
        );
        await act(() => ref.current?.openTimePickerModal());

        const modal = tree.root.findByProps({
            testID: 'timePickerModal'
        }).props;

        expect(modal.isVisible).toBeTruthy();
    });

    it('should close the modal by swiping down', async () => {
        const ref = React.createRef<TimePickerModalElement>();
        const mockOnDismiss = jest.fn();
        const tree = renderer.create(
            <TimePickerModal
                disMissModal={mockOnDismiss}
                ref={ref}
                selectedValue={new Date()}
            />
        );

        await act(async () => {
            ref.current?.openTimePickerModal();
        });
        await act(() => {
            const modal = tree.root.findByProps({
                testID: 'timePickerModal'
            });
            modal.props.onSwipeComplete();
        });

        const modal = tree.root.findByProps({
            testID: 'timePickerModal'
        }).props;

        expect(mockOnDismiss).toBeCalledTimes(1);
        expect(modal.isVisible).toBeFalsy();
    });

    it('should select a Time and trigger the onSelect callback', async () => {
        const selectedDateString = moment(
            '2023-01-01 10:10',
            'YYYY-MM-DD hh:mm'
        ).toDate();
        const onTimeSelected = jest.fn().mockImplementation((date: Date) => {
            expect(moment(date).format('YYYY-MM-DD hh:mm')).toEqual(
                moment(selectedDateString).format('YYYY-MM-DD hh:mm')
            );
        });
        const ref = React.createRef<TimePickerModalElement>();
        const tree = renderer.create(
            <TimePickerModal
                ref={ref}
                selectedValue={selectedDateString}
                onSelect={onTimeSelected}
            />
        );

        await act(() => ref.current?.openTimePickerModal());

        const saveBtn = tree.root.findByProps({
            testID: 'saveBtn'
        }).props;

        await act(() => saveBtn.onPress());

        expect(onTimeSelected).toHaveBeenCalledTimes(1);
    });

    it('should display the correct title based on the locale', async () => {
        const ref = React.createRef<TimePickerModalElement>();
        const tree = renderer.create(
            <TimePickerModal
                ref={ref}
                selectedValue={new Date()}
                locale="en_GB"
            />
        );

        await act(() => ref.current?.openTimePickerModal());
        const title = tree.root.findByProps({
            testID: 'title'
        });

        expect(title.props.children).toEqual('Select Fast Duration');
    });

    it('should display the save button', async () => {
        const ref = React.createRef<TimePickerModalElement>();
        const tree = renderer.create(
            <TimePickerModal
                ref={ref}
                selectedValue={moment('2023-10-01').startOf('d').toDate()}
            />
        );
        await act(() => ref.current?.openTimePickerModal());

        const saveBtn = tree.root.findByProps({
            testID: 'saveBtn'
        });

        expect(saveBtn).toBeTruthy();
    });
});
