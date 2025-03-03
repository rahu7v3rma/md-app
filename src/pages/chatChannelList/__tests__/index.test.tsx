import React from 'react';
import { ActivityIndicator } from 'react-native';
import { act, create } from 'react-test-renderer';
import { ChannelList } from 'stream-chat-react-native';

import { mockChatClient, mockNavigate } from '@/jestSetup';
import { ChatChannelList } from '@/pages';
import { Header } from '@/shared';

jest.mock('stream-chat-react-native', () => ({
    OverlayProvider: jest.fn(({ children }) => <>{children}</>),
    Chat: jest.fn(({ children }) => <>{children}</>),
    ChannelList: jest.fn(() => <></>)
}));

test('displays the header with the correct title', () => {
    const tree = create(<ChatChannelList />);
    const header = tree.root.findByType(Header);
    expect(header.props.title).toBe('Chats');
});

test('navigates to ChatSearch screen on right icon press', async () => {
    const tree = create(<ChatChannelList />);
    const header = tree.root.findByType(Header);
    await act(() => header.props.onRightBtnPress());
    expect(mockNavigate).toBeCalledWith('ChatSearch');
});

test('renders the ChannelList when chatClient is not null', () => {
    const tree = create(<ChatChannelList />);
    const channelList = tree.root.findAllByType(ChannelList);
    expect(channelList).toHaveLength(1);
});

test('displays the loader when chatClient is null', () => {
    mockChatClient.mockImplementationOnce(() => null);
    const tree = create(<ChatChannelList />);
    const loader = tree.root.findAllByType(ActivityIndicator);
    expect(loader).toHaveLength(1);
});
