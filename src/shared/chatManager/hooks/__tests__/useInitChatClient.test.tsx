import React from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

import {
    mockChatProfile,
    mockConnectUser,
    mockDisconnectUser,
    mockGetInstance
} from '@/jestSetup';

import useInitChatClient from '../useInitChatClient';

const TestComponent = () => {
    const { chatClient } = useInitChatClient();
    return <Text onPress={() => chatClient} />;
};

test('should not initialize chatClient when chatProfile is not provided', async () => {
    mockChatProfile.mockImplementationOnce(jest.fn());
    await act(() => {
        create(<TestComponent />);
    });
    expect(mockConnectUser).not.toBeCalled();
});

test('should initialize chatClient when chatProfile is provided', async () => {
    let tree!: ReactTestRenderer;
    await act(() => {
        tree = create(<TestComponent />);
    });
    expect(mockConnectUser).toBeCalled();
    expect(tree.root.findByType(Text).props.onPress()).toStrictEqual(
        mockGetInstance()
    );
});

jest.spyOn(console, 'log').mockImplementation(jest.fn());

test('should handle errors when initializing chatClient', async () => {
    mockGetInstance.mockImplementationOnce(jest.fn());
    let tree!: ReactTestRenderer;
    await act(() => {
        tree = create(<TestComponent />);
    });
    expect(tree.root.findByType(Text).props.onPress()).toBe(null);
});

test('should disconnect chatClient on unmount', async () => {
    let tree!: ReactTestRenderer;
    await act(() => {
        tree = create(<TestComponent />);
    });
    await act(() => tree.unmount());
    expect(mockDisconnectUser).toBeCalled();
});
