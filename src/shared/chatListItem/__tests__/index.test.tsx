import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { ChatListItem } from '@/shared';

it('chatListItem snapshot', async () => {
    const tree = renderer.create(<ChatListItem label={'label'} />);
    expect(tree).toMatchSnapshot();
});

it('chatListItem renders without errors', async () => {
    const tree = renderer.create(<ChatListItem label={'label'} />);
    expect(tree.root).toBeTruthy();
});

it('calls onPress callback when pressed', async () => {
    const onPress = jest.fn();
    const tree = renderer.create(
        <ChatListItem
            onPress={onPress}
            label={'label'}
            mainTouchID={'mainTouchID'}
        />
    );
    let mainTouchID = tree.root.findByProps({
        testID: 'mainTouchID'
    }).props;
    await act(() => mainTouchID.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('displays online dot when isOnline prop is true', async () => {
    const tree = renderer.create(
        <ChatListItem label={'label'} isOnline={true} />
    );
    let onlineView = tree.root.findByProps({
        testID: 'online'
    }).props;
    expect(onlineView).toBeTruthy();
});

it('displays newMessagesCount when it is greater than 0', async () => {
    const tree = renderer.create(
        <ChatListItem
            label={'label'}
            newMessagesCount={3}
            time={'12:00'}
            msgCountID={'msgCountID'}
        />
    );
    let msgCountID = tree.root.findByProps({
        testID: 'msgCountID'
    }).props;
    expect(msgCountID).toBeTruthy();
});
