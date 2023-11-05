import React, { FunctionComponent } from 'react';
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
    Giphy
} from 'stream-chat-react-native';

import { Text } from '@/shared';

type Props = {
    messageId: string;
    attachment: AttachmentType;
};

const MessageContentAttachment: FunctionComponent<Props> = ({
    messageId,
    attachment
}: Props) => {
    if (attachment.type === 'giphy') {
        return <Giphy attachment={attachment} />;
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
    } else if (attachment.type === 'image') {
        const attachmentArray = [];
        attachmentArray.push(attachment);
        return <Gallery images={attachmentArray} />;
    } else {
        // return the stream builtin attachment component
        return <Attachment attachment={attachment} />;
    }
};

export default MessageContentAttachment;

const styles = StyleSheet.create({
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
    }
});
