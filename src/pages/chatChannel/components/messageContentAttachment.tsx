import React, { FunctionComponent, RefObject } from 'react';
import {
    Image,
    Linking,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { Attachment as AttachmentType } from 'stream-chat';
import {
    Attachment,
    FileAttachmentGroup,
    Gallery,
    Giphy,
    PDF
} from 'stream-chat-react-native';

import { Text } from '@/shared';
import { PdfViewerHandle } from '@/shared/pdfViewer';
import { Size } from '@/shared/text';

type Props = {
    messageId: string;
    attachment: AttachmentType;
    pdfViewerRef: RefObject<PdfViewerHandle>;
};

type GroupProps = {
    messageId: string;
    attachments: AttachmentType[];
    pdfViewerRef: RefObject<PdfViewerHandle>;
};

const MessageContentAttachment: FunctionComponent<Props> = ({
    messageId,
    attachment,
    pdfViewerRef
}: Props) => {
    if (attachment.type === 'giphy') {
        return <Giphy attachment={attachment} preventPress={true} />;
    } else if (attachment.title_link) {
        // return link preview attachment component
        return (
            <TouchableOpacity
                style={styles.linkPreviewContainer}
                testID="linkClickable"
                onPress={() =>
                    attachment.title_link &&
                    Linking.openURL(attachment.title_link)
                }
            >
                {attachment.thumb_url && (
                    <Image
                        style={styles.linkThumnbail}
                        resizeMode="contain"
                        source={{ uri: attachment.thumb_url }}
                    />
                )}
                <View style={styles.linkTextContainer}>
                    {attachment.title && (
                        <Text fontWeight="500">{attachment.title}</Text>
                    )}
                    <Text>{attachment.title_link}</Text>
                </View>
            </TouchableOpacity>
        );
    } else if (attachment.type === 'audio') {
        return (
            <FileAttachmentGroup messageId={messageId} files={[attachment]} />
        );
    } else if (attachment.type === 'image' || attachment.type === 'video') {
        const attachmentArray = [];
        attachmentArray.push(attachment);
        return <Gallery images={attachmentArray} preventPress={true} />;
    } else if (
        attachment.type === 'file' &&
        attachment.mime_type === 'application/pdf'
    ) {
        const onPressPdfContainer = () => {
            if (attachment.asset_url && attachment.title) {
                pdfViewerRef.current?.open(
                    attachment.asset_url,
                    attachment.title
                );
            }
        };
        const attachmentFileSize = !isNaN(Number(attachment.file_size))
            ? Math.floor(Number(attachment.file_size) / 1000)
            : 0;
        return (
            <TouchableOpacity
                style={styles.pdfContainer}
                onPress={onPressPdfContainer}
            >
                <PDF />
                <View style={styles.pdfTextContainer}>
                    <Text fontWeight="700" size={Size.XXSmall}>
                        {attachment.title}
                    </Text>
                    {attachmentFileSize > 0 && (
                        <Text size={Size.XXXSmall}>
                            {attachmentFileSize} KB
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    } else {
        // return the stream builtin attachment component
        return <Attachment attachment={attachment} />;
    }
};

const MessageContentAttachmentGroup: FunctionComponent<GroupProps> = ({
    messageId,
    attachments,
    pdfViewerRef
}: GroupProps) => {
    return (
        <View style={styles.attachments}>
            {attachments
                .filter(
                    (attachment: AttachmentType) =>
                        attachment.type !== 'image' &&
                        attachment.type !== 'video'
                )
                .map((attachment: AttachmentType, ind: number) => (
                    <View
                        key={`message-${messageId}-attachment-${ind}`}
                        style={styles.attachmentItem}
                    >
                        <MessageContentAttachment
                            messageId={messageId}
                            attachment={attachment}
                            pdfViewerRef={pdfViewerRef}
                        />
                    </View>
                ))}
            <View key={`message-${messageId}`} style={styles.attachmentItem}>
                <Gallery />
            </View>
        </View>
    );
};

export default MessageContentAttachmentGroup;

const styles = StyleSheet.create({
    attachments: {
        flexDirection: 'column',
        marginTop: 5,
        justifyContent: 'flex-start'
    },
    attachmentItem: {
        marginVertical: 5
    },
    linkPreviewContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#EEF4FA',
        borderRadius: 16,
        padding: 16,
        borderColor: '#D3E6F8',
        borderStyle: 'solid',
        borderWidth: 1
    },
    linkThumnbail: {
        flex: 1
    },
    linkTextContainer: {
        flex: 4,
        flexDirection: 'column'
    },
    attachmentImg: {
        width: '90%',
        height: 150,
        marginTop: 5
    },
    pdfContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        gap: 15
    },
    pdfTextContainer: {
        flexDirection: 'column'
    }
});
