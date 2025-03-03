import React from 'react';
import { Linking, View as mockView } from 'react-native';
import renderer, { act } from 'react-test-renderer';
import {
    Attachment,
    FileAttachmentGroup,
    Gallery,
    Giphy
} from 'stream-chat-react-native';

import { mockAttachment } from '@/utils/mockData';

import MessageContentAttachment from '../messageContentAttachment';

jest.mock('stream-chat-react-native', () => {
    return {
        Gallery: mockView,
        Giphy: mockView,
        FileAttachmentGroup: mockView,
        Attachment: mockView
    };
});
it('messageContentAttachment snapshot', async () => {
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    expect(tree).toMatchSnapshot();
});

it('messageContentAttachment renders without errors', async () => {
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    expect(tree.root).toBeTruthy();
});

it('opens the link when the link preview is pressed', async () => {
    delete mockAttachment.type;
    mockAttachment.title_link = 'title_link.com';
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    let linkClickable = tree.root.findByProps({
        testID: 'linkClickable'
    }).props;
    const openUrlSpy = jest.spyOn(Linking, 'openURL');
    await act(() => linkClickable.onPress());
    expect(openUrlSpy).toHaveBeenCalledWith('title_link.com');
});

it('displays the attachment title correctly', async () => {
    delete mockAttachment.type;
    mockAttachment.title_link = 'title_link.com';
    mockAttachment.title = 'title_text';
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    let titleText = tree.root.findByProps({
        fontWeight: '500'
    }).props;
    expect(titleText.children).toBe('title_text');
});

it('displays the attachment thumbnail correctly', async () => {
    delete mockAttachment.type;
    mockAttachment.title_link = 'title_link.com';
    mockAttachment.thumb_url = 'thumbnail_url.com';
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    let thumbImage = tree.root.findByProps({
        resizeMode: 'contain'
    }).props;
    expect(thumbImage.source).toStrictEqual({ uri: 'thumbnail_url.com' });
});

it('displays the attachment image correctly for image type attachment', async () => {
    mockAttachment.type = 'image';
    delete mockAttachment.title_link;
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    const attachmentArray = [];
    attachmentArray.push(mockAttachment);
    let galleryOfImage = tree.root.findByType(Gallery).props;
    expect(galleryOfImage.images).toStrictEqual(attachmentArray);
});

it('renders the appropriate component based on the attachment type', async () => {
    mockAttachment.type = 'giphy';
    const tree = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    let giphyCompoenent = tree.root.findByType(Giphy).props;
    expect(giphyCompoenent).toBeTruthy();

    mockAttachment.type = 'audio';
    const treeOfAudio = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    let fileAttachCompoenent =
        treeOfAudio.root.findByType(FileAttachmentGroup).props;
    expect(fileAttachCompoenent).toBeTruthy();

    mockAttachment.type = 'other';
    const treeOfAttachment = renderer.create(
        <MessageContentAttachment
            messageId={'messageId'}
            attachment={mockAttachment}
        />
    );
    let attachCompoenent = treeOfAttachment.root.findByType(Attachment).props;
    expect(attachCompoenent).toBeTruthy();
});
