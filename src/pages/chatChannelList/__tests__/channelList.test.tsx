import moment from 'moment';
import React, { ElementType } from 'react';
import renderer, { act } from 'react-test-renderer';
import { Channel } from 'stream-chat';
import {
    DefaultStreamChatGenerics,
    LatestMessagePreview
} from 'stream-chat-react-native';

import * as Hooks from '@/hooks';
import { mockNavigate } from '@/jestSetup';

import ChannelList from '../components/channelList';

jest.mock('stream-chat-react-native');

jest.unmock('@/hooks');

const mockLatestMessagePreview = {
    messageObject: {
        created_at: '2023-10-26T11:49:25.552Z'
    }
};

const mockChannel = {
    cid: 'message:1000'
};

jest.mock('@/hooks', () => ({
    useChannelPreviewInfo: jest.fn().mockReturnValue({
        displayImage: undefined,
        displayTitle: 'Coach',
        isOnline: true
    })
}));

describe('channelList tests', () => {
    let tree: renderer.ReactTestRenderer;

    it('Match Snapshot', () => {
        tree = renderer.create(
            <ChannelList
                channel={
                    mockChannel as any as Channel<DefaultStreamChatGenerics>
                }
                latestMessagePreview={
                    mockLatestMessagePreview as any as LatestMessagePreview<DefaultStreamChatGenerics>
                }
                unread={10}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it('renders channel information correctly', () => {
        tree = renderer.create(
            <ChannelList
                channel={jest.fn() as any as Channel<DefaultStreamChatGenerics>}
                latestMessagePreview={
                    mockLatestMessagePreview as any as LatestMessagePreview<DefaultStreamChatGenerics>
                }
                unread={10}
            />
        );
        expect(tree.root.findByProps({ testID: 'online' })).toBeTruthy();
        expect(
            tree.root.findByProps({ testID: 'displayTitle' }).props.children
        ).toEqual('Coach');
        expect(
            tree.root.findByType('Image' as ElementType).props.source.testUri
        ).toEqual('../../../src/assets/images/default_avatar.jpg');
    });

    it('when user is offline', () => {
        jest.spyOn(Hooks, 'useChannelPreviewInfo').mockImplementation(() => ({
            displayImage: undefined,
            displayTitle: 'Coach',
            isOnline: false,
            totalMembers: 14
        }));
        tree = renderer.create(
            <ChannelList
                channel={
                    mockChannel as any as Channel<DefaultStreamChatGenerics>
                }
                latestMessagePreview={
                    mockLatestMessagePreview as any as LatestMessagePreview<DefaultStreamChatGenerics>
                }
                unread={10}
            />
        );
        expect(tree.root.findAllByProps({ testID: 'online' }).length).toEqual(
            0
        );
    });

    it('navigates to the ChatChannel screen on press', async () => {
        tree = renderer.create(
            <ChannelList
                channel={
                    mockChannel as any as Channel<DefaultStreamChatGenerics>
                }
                latestMessagePreview={
                    mockLatestMessagePreview as any as LatestMessagePreview<DefaultStreamChatGenerics>
                }
                unread={10}
            />
        );
        await act(() => (tree.root.children[0] as any).props.onPress());
        expect(mockNavigate).toBeCalledWith('ChatChannel', {
            channelId: mockChannel.cid
        });
    });

    it('displays the correct latest message date format', async () => {
        tree = renderer.create(
            <ChannelList
                channel={
                    mockChannel as any as Channel<DefaultStreamChatGenerics>
                }
                latestMessagePreview={
                    mockLatestMessagePreview as any as LatestMessagePreview<DefaultStreamChatGenerics>
                }
                unread={10}
            />
        );

        expect(
            tree.root.findByProps({ testID: 'messageDate' }).props.children
        ).toEqual(
            moment(mockLatestMessagePreview.messageObject.created_at).format(
                'hh:mm A'
            )
        );
    });

    it('displays the unread count correctly', async () => {
        tree = renderer.create(
            <ChannelList
                channel={
                    mockChannel as any as Channel<DefaultStreamChatGenerics>
                }
                latestMessagePreview={
                    mockLatestMessagePreview as any as LatestMessagePreview<DefaultStreamChatGenerics>
                }
                unread={10}
            />
        );
        expect(
            tree.root.findByProps({ testID: 'unread' }).props.children
        ).toEqual(10);
    });
});
