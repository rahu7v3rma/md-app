import React from 'react';
import { Linking, View as mockView } from 'react-native';
import { act, create } from 'react-test-renderer';

import { mockChatClient } from '@/jestSetup';

import MessageContent from '../messageContent';

const mockMessageContext = {
    message: {
        user: {
            id: '1',
            name: 'John Doe'
        },
        text: 'https://example.com This is a test message',
        latest_reactions: [],
        created_at: '2023-10-23T12:34:56.789Z',
        attachments: [],
        reaction_counts: {
            like: 2
        }
    },
    reactions: [],
    handleToggleReaction: jest.fn()
};

jest.mock('stream-chat-react-native', () => {
    return {
        Gallery: mockView,
        Giphy: mockView,
        FileAttachmentGroup: mockView,
        Attachment: mockView,
        useChatContext: jest.fn().mockImplementation(() => ({
            client: mockChatClient
        })),
        useMessageContext: jest
            .fn()
            .mockImplementation(() => mockMessageContext),
        ThumbsUpReaction: jest.fn().mockImplementation(() => {
            return <></>;
        })
    };
});

jest.mock('react-native-config', () => ({
    API_BASE_URL: 'your_mocked_api_base_url'
}));

describe('MessageContent', () => {
    it('matches snapshot', () => {
        const tree = create(<MessageContent />);
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        const tree = create(<MessageContent />);
        expect(tree.root).toBeTruthy();
    });

    it('opens the URL when a link in the message is pressed', async () => {
        const openURLSpy = jest
            .spyOn(Linking, 'openURL')
            .mockImplementation(() => Promise.resolve());

        let tree: any;
        await act(async () => {
            tree = create(<MessageContent />);
        });

        const linkElement = tree.root.findByProps({
            testID: 'message-link'
        });
        linkElement.props.onPress();

        expect(openURLSpy).toHaveBeenCalledWith('https://example.com');

        openURLSpy.mockRestore();
    });

    it('displays the user name correctly', () => {
        const tree = create(<MessageContent />);

        const userNameElement = tree.root.findByProps({
            testID: 'user-name'
        });

        expect(userNameElement.props.children).toBe('John Doe');
    });

    it('displays the message text correctly', async () => {
        const testMessage = 'This is a test message';
        mockMessageContext.message.text = testMessage;

        const tree = create(<MessageContent />);

        const messageTextElement = tree.root.findByProps({
            testID: 'message-text'
        });

        expect(messageTextElement.props.children).toEqual([testMessage]);
    });

    it('displays the number of likes correctly', () => {
        const tree = create(<MessageContent />);

        const likeCountElement = tree.root.findByProps({
            testID: 'like-count'
        });

        expect(likeCountElement.props.children).toBe(2);
    });

    it('opens the reactions list when the like icon is pressed', async () => {
        let tree: any;
        await act(async () => {
            tree = create(<MessageContent />);
        });
        const likeIconElement = tree.root.findByProps({
            testID: 'like-icon'
        });
        await act(() => likeIconElement.props.onPress());
        let reactionsList;
        try {
            reactionsList = tree.root.findByProps({
                testID: 'reactionsList'
            }).props;
        } catch (e) {}
        expect(reactionsList).toBeTruthy();
    });
});
