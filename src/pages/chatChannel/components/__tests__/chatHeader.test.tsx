import React from 'react';
import renderer from 'react-test-renderer';

import { useAppChat } from '@/contexts/appChat';
import { mockChannelId } from '@/jestSetup';

import ChatHeader from '../chatHeader';

jest.mock('@/contexts/appChat');

describe('chatHeader', () => {
    const { chatClient } = useAppChat();
    it('chatHeader snapshot', async () => {
        const tree = renderer.create(
            <ChatHeader channel={chatClient?.activeChannels[mockChannelId]!} />
        );
        expect(tree).toMatchSnapshot();
    });

    it('ChatHeader renders without crashing', async () => {
        const tree = renderer.create(
            <ChatHeader channel={chatClient?.activeChannels[mockChannelId]!} />
        );
        expect(tree.root).toBeTruthy();
    });

    it('ChatHeader triggers onBack function when the back button is pressed', async () => {
        const onBack = jest.fn();
        const tree = renderer.create(
            <ChatHeader
                channel={chatClient?.activeChannels[mockChannelId]!}
                onBack={onBack}
            />
        );
        const backButton = tree.root.findByProps({
            testID: 'backButton'
        }).props;
        backButton.onPress();
        expect(onBack).toHaveBeenCalled();
    });

    it('ChatHeader triggers onTitlePress function when the title is pressed with more than 2 members', async () => {
        jest.spyOn(
            require('@/hooks'),
            'useChannelPreviewInfo'
        ).mockImplementation(() => ({
            displayImage: '',
            displayTitle: '',
            isOnline: true,
            totalMembers: 3
        }));
        const onTitlePress = jest.fn();
        const tree = renderer.create(
            <ChatHeader
                channel={chatClient?.activeChannels[mockChannelId]!}
                onTitlePress={onTitlePress}
            />
        );
        const titlePress = tree.root.findByProps({
            testID: 'titlePress'
        }).props;
        titlePress.onPress();
        expect(onTitlePress).toHaveBeenCalled();
    });

    it('ChatHeader does not trigger onTitlePress function when the title is pressed with 2 or fewer members', async () => {
        jest.spyOn(
            require('@/hooks'),
            'useChannelPreviewInfo'
        ).mockImplementation(() => ({
            displayImage: '',
            displayTitle: '',
            isOnline: true,
            totalMembers: 2
        }));

        const onTitlePress = jest.fn();
        const tree = renderer.create(
            <ChatHeader
                channel={chatClient?.activeChannels[mockChannelId]!}
                onTitlePress={onTitlePress}
            />
        );
        const titlePress = tree.root.findByProps({
            testID: 'titlePress'
        }).props;
        titlePress.onPress();
        expect(onTitlePress).not.toHaveBeenCalled();
    });

    it('ChatHeader displays the channel name correctly', async () => {
        jest.spyOn(
            require('@/hooks'),
            'useChannelPreviewInfo'
        ).mockImplementation(() => ({
            displayImage: '',
            displayTitle: 'test',
            isOnline: true,
            totalMembers: null
        }));
        const tree = renderer.create(
            <ChatHeader channel={chatClient?.activeChannels[mockChannelId]!} />
        );
        const displayTitle = tree.root.findByProps({
            testID: 'displayTitle'
        }).props;
        expect(displayTitle.children).toBe('test');
    });

    it('ChatHeader displays the correct number of members in the channel', async () => {
        jest.spyOn(
            require('@/hooks'),
            'useChannelPreviewInfo'
        ).mockImplementation(() => ({
            displayImage: '',
            displayTitle: '',
            isOnline: true,
            totalMembers: 3
        }));
        const tree = renderer.create(
            <ChatHeader channel={chatClient?.activeChannels[mockChannelId]!} />
        );
        const totalMembers = tree.root.findByProps({
            testID: 'totalMembers'
        }).props;
        expect(totalMembers.children).toBe('3' + ' ' + 'members');
    });
});
