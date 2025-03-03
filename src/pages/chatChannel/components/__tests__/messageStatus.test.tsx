import React from 'react';
import { create } from 'react-test-renderer';
import {
    isMessageWithStylesReadByAndDateSeparator,
    useMessageContext
} from 'stream-chat-react-native';

import Check from '@/assets/svg/check';
import DoubleCheck from '@/assets/svg/doubleCheck';

import MessageStatus from '../messageStatus';

jest.mock('stream-chat-react-native', () => ({
    isMessageWithStylesReadByAndDateSeparator: jest.fn(),
    useMessageContext: jest.fn()
}));

const mockMessage = ({
    withStyles,
    isMyMessage,
    type,
    readBy,
    status
}: any) => {
    (
        isMessageWithStylesReadByAndDateSeparator as unknown as jest.Mock
    ).mockReturnValueOnce(withStyles);
    (useMessageContext as jest.Mock).mockReturnValueOnce({
        isMyMessage,
        message: { type, readBy, status }
    });
};

test('Match Snapshot - Check', () => {
    mockMessage({
        withStyles: false,
        isMyMessage: true,
        type: 'regular',
        readBy: false,
        status: 'received'
    });
    expect(create(<MessageStatus />).toJSON()).toMatchSnapshot();
});

test('Match Snapshot - DoubleCheck', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: true,
        type: 'regular',
        readBy: true,
        status: 'received'
    });
    expect(create(<MessageStatus />).toJSON()).toMatchSnapshot();
});

test('renders without crashing', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: true,
        type: 'regular',
        readBy: true,
        status: 'received'
    });
    const tree = create(<MessageStatus />);
    expect(tree).toBeTruthy();
});

test('renders DoubleCheck component when the message is read', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: true,
        type: 'regular',
        readBy: true,
        status: 'received'
    });
    const tree = create(<MessageStatus />);
    expect(tree.root.findAllByType(DoubleCheck)).toHaveLength(1);
});

test('renders Check component when the message status is received', () => {
    mockMessage({
        withStyles: false,
        isMyMessage: true,
        type: 'regular',
        readBy: false,
        status: 'received'
    });
    const tree = create(<MessageStatus />);
    expect(tree.root.findAllByType(Check)).toHaveLength(1);
});

test('does not render any component when the message is not from the current user', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: false,
        type: 'regular',
        readBy: true,
        status: 'received'
    });
    const tree = create(<MessageStatus />);
    expect(tree.root.children).toHaveLength(0);
});

test('does not render any component when the message type is error', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: true,
        type: 'error',
        readBy: true,
        status: 'received'
    });
    const tree = create(<MessageStatus />);
    expect(tree.root.children).toHaveLength(0);
});

test('does not render any component when the message readBy property is not a number', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: true,
        type: 'regular',
        readBy: 'readBy',
        status: 'notReceived'
    });
    const tree = create(<MessageStatus />);
    expect(tree.root.children).toHaveLength(0);
});

test('does not render any component when the message readBy property is not true', () => {
    mockMessage({
        withStyles: true,
        isMyMessage: true,
        type: 'regular',
        readBy: false,
        status: 'notReceived'
    });
    const tree = create(<MessageStatus />);
    expect(tree.root.children).toHaveLength(0);
});
