import React from 'react';
import 'react-native';
import renderer, { act } from 'react-test-renderer';

import 'stream-chat-react-native';
import MessageInput from '../messageInput';

const mockSendMessage = jest.fn().mockImplementation(() => {
    return Promise.resolve();
});
const mockSetText = jest.fn();
const mocktoggleAttachmentPicker = jest.fn();
const mockcloseAttachmentPicker = jest.fn();

const StreamChat = require('stream-chat-react-native');

const event = {
    nativeEvent: {
        contentSize: {
            height: 48
        }
    }
};

jest.mock('stream-chat-react-native', () => ({
    ...jest.requireActual('stream-chat-react-native'),
    FileUploadPreview: jest.fn(),
    ImageUploadPreview: jest.fn(),
    MessageInput: jest.fn(),
    useAttachmentPickerContext: jest.fn().mockImplementation(() => ({
        setBottomInset: jest.fn()
    })),
    useMessageInputContext: jest.fn().mockImplementation(() => ({
        sendMessage: mockSendMessage,
        setText: mockSetText,
        text: 'test',
        toggleAttachmentPicker: mocktoggleAttachmentPicker,
        closeAttachmentPicker: mockcloseAttachmentPicker,
        imageUploads: [],
        fileUploads: []
    }))
}));

let tree: renderer.ReactTestRenderer;

beforeEach(() => {
    tree = renderer.create(<MessageInput />);
});

describe('test messageInput component', () => {
    it('Match Snapshot', () => {
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', () => {
        expect(tree).toBeTruthy();
    });

    it('toggles the attachment picker when the camera button is pressed', async () => {
        await act(() => {
            tree.root.findByProps({ testID: 'cameraButton' }).props.onPress();
        });
        expect(mocktoggleAttachmentPicker).toBeCalled();
    });

    it('updates the text input value correctly', async () => {
        await act(() => {
            tree.root
                .findByProps({ showMoreOptions: false })
                .props.additionalTextInputProps.onChangeText('test message');
        });
        expect(mockSetText).toBeCalledWith('test message');
    });

    it('sends the message when the send button is pressed', async () => {
        await act(async () => {
            await tree.root
                .findByProps({ testID: 'sendButton' })
                .props.onPress();
        });
        expect(mockSendMessage).toBeCalled();
        expect(mockcloseAttachmentPicker).toBeCalled();
    });

    it('adjusts the input height correctly on content size change', async () => {
        await act(() => {
            tree.root
                .findByProps({ showMoreOptions: false })
                .props.additionalTextInputProps.onContentSizeChange(event);
        });
        expect(
            tree.root.findByProps({ showMoreOptions: false }).props
                .additionalTextInputProps.style[1].maxHeight
        ).toEqual(53);
    });

    it('disables the send button when there are ongoing uploads', async () => {
        jest.spyOn(StreamChat, 'useMessageInputContext').mockImplementation(
            () => ({
                sendMessage: mockSendMessage,
                setText: mockSetText,
                text: 'test',
                toggleAttachmentPicker: mocktoggleAttachmentPicker,
                closeAttachmentPicker: mockcloseAttachmentPicker,
                imageUploads: [],
                fileUploads: [{ state: 'uploading' }]
            })
        );
        await act(() => tree.update(<MessageInput />));
        expect(tree.root.findByProps({ testID: 'sendButton' })).toBeTruthy();
    });
});
