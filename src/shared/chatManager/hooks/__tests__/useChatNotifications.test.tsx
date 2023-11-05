import React from 'react';
import { act, create } from 'react-test-renderer';
import { StreamChat } from 'stream-chat';

import { mockChatProfile, mockOnTokenRefresh } from '@/jestSetup';
import { registerFirebaseMessageListener } from '@/services/notification';

import useChatNotifications from '../useChatNotifications';

const TestComponent = ({
    chatClient,
    activeChatChannel
}: {
    chatClient: StreamChat | null;
    activeChatChannel: string | null;
}) => {
    useChatNotifications(chatClient, activeChatChannel);
    return <></>;
};

test('does not register chat push token when chatClient is not defined', async () => {
    await act(() => {
        create(
            <TestComponent
                chatClient={null}
                activeChatChannel="mockActiveChatChannel"
            />
        );
    });
    expect(mockOnTokenRefresh).not.toBeCalled();
});

test('does not register chat push token when chatProfile is not defined', async () => {
    mockChatProfile.mockImplementationOnce(jest.fn());
    await act(() => {
        create(
            <TestComponent
                chatClient={{ addDevice: jest.fn() } as unknown as StreamChat}
                activeChatChannel="mockActiveChatChannel"
            />
        );
    });
    expect(mockOnTokenRefresh).not.toBeCalled();
});

test('registers chat push token and handles token refresh when chatClient and chatProfile are defined', async () => {
    await act(() => {
        create(
            <TestComponent
                chatClient={{ addDevice: jest.fn() } as unknown as StreamChat}
                activeChatChannel="mockActiveChatChannel"
            />
        );
    });
    expect(mockOnTokenRefresh).toBeCalled();
});

test('handles foreground message received', async () => {
    await act(() => {
        create(
            <TestComponent
                chatClient={{ addDevice: jest.fn() } as unknown as StreamChat}
                activeChatChannel="mockActiveChatChannel"
            />
        );
    });
    expect(registerFirebaseMessageListener).toBeCalled();
});
