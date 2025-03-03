import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

import {
    mockChannelId,
    mockChatClient,
    mockGetChannelDisplayImage
} from '@/jestSetup';
import ChatNotificationImage from '@/pages/notifications/components/chatNotificationImage';
import { ChatAvatar } from '@/shared';

jest.mock('@/shared/platformImage');

const mockChannelDisplayImage = 'mockChannelDisplayImage';
mockGetChannelDisplayImage.mockImplementation(() => mockChannelDisplayImage);

test('Snapshot Testing with Jest', async () => {
    let tree = create(<ChatNotificationImage channelId={mockChannelId} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders without crashing', async () => {
    let tree = create(<ChatNotificationImage channelId={mockChannelId} />);
    expect(tree.root).toBeTruthy();
});

describe('renders a ChatAvatar with the correct props when chatClient and channelId are provided', () => {
    let tree!: ReactTestRenderer;
    act(() => {
        tree = create(<ChatNotificationImage channelId={mockChannelId} />);
    });
    const chatAvatar = tree.root.findByType(ChatAvatar);
    expect(chatAvatar.props.path).toBe(mockChannelDisplayImage);
});

test('renders undefined when chatClient is not available', () => {
    mockChatClient.mockResolvedValue(null);
    let tree!: ReactTestRenderer;
    act(() => {
        tree = create(<ChatNotificationImage channelId={mockChannelId} />);
    });
    const chatAvatar = tree.root.findByType(ChatAvatar);
    expect(chatAvatar.props.path).toBe(undefined);
});

test('renders undefined when chatChannel is not available', () => {
    let tree!: ReactTestRenderer;
    act(() => {
        tree = create(
            <ChatNotificationImage channelId={'unavailableChatChannelId'} />
        );
    });
    const chatAvatar = tree.root.findByType(ChatAvatar);
    expect(chatAvatar.props.path).toBe(undefined);
});
