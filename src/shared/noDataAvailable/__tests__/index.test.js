import React from 'react';
import { create } from 'react-test-renderer';

import NoDataAvailable from '@/shared/noDataAvailable';

const mockMessage = 'mockMessage';
const mockActionMessage = 'mockActionMessage';
const messageTextTestId = 'messageText';
const actionMessageTextTestId = 'actionMessageText';

test('snapshot / renders without errors', () => {
    expect(
        create(<NoDataAvailable message={mockMessage} />).toJSON()
    ).toMatchSnapshot();
});

test('displays the provided message correctly / does not display the action message when not provided', () => {
    const tree = create(<NoDataAvailable message={mockMessage} />);
    const messageText = tree.root.findByProps({ testID: messageTextTestId });
    expect(messageText.props.children).toBe(mockMessage);
    expect(
        tree.root.findAllByProps({ testID: actionMessageTextTestId })
    ).toHaveLength(0);
});

test('displays the action message when provided', () => {
    const tree = create(
        <NoDataAvailable
            message={mockMessage}
            actionMessage={mockActionMessage}
        />
    );
    const actionMessageText = tree.root.findByProps({
        testID: actionMessageTextTestId
    });
    expect(actionMessageText.props.children).toBe(mockActionMessage);
});
