import React, { FunctionComponent, useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Attachment } from 'stream-chat';
import { FileIcon, PDF, Play } from 'stream-chat-react-native';

import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';

type Props = {
    userImage?: string;
    attachments?: Attachment[];
    text?: string;
    attachmentIconSize?: number;
    textLength?: number;
};

const MessageQuoted: FunctionComponent<Props> = ({
    userImage,
    attachments,
    text,
    attachmentIconSize = 50,
    textLength = 100
}) => {
    const ImageThumbnail = useCallback(
        ({ attachment }: { attachment: Attachment }) => {
            const uri = () => {
                switch (attachment.type) {
                    case 'image':
                        return attachment.image_url;
                    case 'giphy':
                    case 'video':
                        return attachment.thumb_url;
                    default:
                        return '';
                }
            };
            return (
                <Image
                    source={{ uri: uri() }}
                    height={attachmentIconSize}
                    width={attachmentIconSize}
                    style={styles.image}
                />
            );
        },
        [attachmentIconSize]
    );
    const AudioThumbnail = useCallback(() => {
        return (
            <View
                style={{
                    ...styles.audioView,
                    height: attachmentIconSize,
                    width: attachmentIconSize
                }}
            >
                <Play height={24} width={24} pathFill={'black'} />
            </View>
        );
    }, [attachmentIconSize]);
    const TextFormatted = useCallback(() => {
        if (text) {
            return (
                <Text size={Size.XXXSmall}>
                    {text.length > textLength
                        ? text.slice(0, textLength) + '...'
                        : text}
                </Text>
            );
        }
        return <></>;
    }, [text, textLength]);
    const AttachmentThumbnail = useCallback(
        ({ attachment }: { attachment: Attachment }) => {
            switch (attachment.type) {
                case 'image':
                case 'giphy':
                case 'video':
                    return <ImageThumbnail attachment={attachment} />;
                case 'audio':
                    return <AudioThumbnail />;
                case 'file':
                    return attachment.mime_type === 'application/pdf' ? (
                        <PDF
                            width={attachmentIconSize}
                            height={attachmentIconSize}
                        />
                    ) : (
                        <FileIcon size={attachmentIconSize} />
                    );
                default:
                    return <></>;
            }
        },
        [attachmentIconSize, ImageThumbnail, AudioThumbnail]
    );
    return (
        <View style={styles.container}>
            <ChatAvatar
                path={userImage}
                width={30}
                height={30}
                style={styles.chatAvatar}
            />
            <View style={styles.contentContainer}>
                {attachments && attachments.length > 0 && (
                    <View style={styles.attachmentsContainer}>
                        {attachments.map((attachment, index) => (
                            <AttachmentThumbnail
                                attachment={attachment}
                                key={index}
                            />
                        ))}
                    </View>
                )}
                <TextFormatted />
            </View>
        </View>
    );
};

export default MessageQuoted;

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.2,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 10,
        marginTop: 8,
        marginBottom: 8,
        height: 'auto',
        flexDirection: 'row',
        gap: 10
    },
    chatAvatar: { alignSelf: 'flex-start' },
    contentContainer: {
        flexDirection: 'column',
        flex: 1,
        gap: 10
    },
    attachmentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 5
    },
    image: {
        resizeMode: 'cover',
        borderRadius: 5
    },
    audioView: {
        borderWidth: 0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'gray',
        borderRadius: 5
    }
});
