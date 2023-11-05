import Moment from 'moment';
import React, { FunctionComponent, useMemo, useRef, useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Attachment } from 'stream-chat';
import {
    ThumbsUpReaction,
    useChatContext,
    useMessageContext
} from 'stream-chat-react-native';

import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import MessageContentAttachment from './messageContentAttachment';
import MessageStatus from './messageStatus';

type Props = Record<string, never>;

const MessageContent: FunctionComponent<Props> = ({}: Props) => {
    const { client } = useChatContext();

    const { message, reactions, handleToggleReaction } = useMessageContext();

    const isSenderMe = client.userID === message.user?.id;

    const urlifiedMessageText = useMemo(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        return message.text
            ?.split(urlRegex)
            .map((part: string, ind: number) => {
                if (part.match(urlRegex)) {
                    return (
                        <Text
                            key={`message-${message.id}-part-${ind}`}
                            style={styles.linkText}
                            color={Colors.text.link}
                            onPress={() => {
                                Linking.openURL(part);
                            }}
                        >
                            {part}
                        </Text>
                    );
                }
                return part;
            });
    }, [message]);

    const [isReactionsSelectorVisible, setIsReactionsSelectorVisible] =
        useState(false);

    const bottomSheetRef = useRef<RBSheet>();

    const reactionUsers = message.latest_reactions?.map((r) => r.user);

    const didILike = !!reactions.filter((r) => r.own && r.type === 'like')
        .length;

    return (
        <>
            <Tooltip
                isVisible={isReactionsSelectorVisible}
                content={
                    <TouchableOpacity
                        onPress={() => {
                            setIsReactionsSelectorVisible(false);
                            handleToggleReaction('like');
                        }}
                    >
                        <ThumbsUpReaction
                            pathFill={didILike ? 'blue' : 'gray'}
                            width={30}
                            height={30}
                        />
                    </TouchableOpacity>
                }
                arrowSize={styles.tooltipArrowSize}
                onClose={() => setIsReactionsSelectorVisible(false)}
                parentWrapperStyle={styles.container}
                contentStyle={styles.tooltipContent}
            >
                <TouchableOpacity
                    key={message.id}
                    style={[
                        styles.messageContainer,
                        isSenderMe ? styles.senderMe : styles.senderNotMe
                    ]}
                    onLongPress={() => {
                        setIsReactionsSelectorVisible(true);
                    }}
                >
                    <View style={styles.avatarView}>
                        <ChatAvatar
                            path={message.user?.image}
                            width={40}
                            height={40}
                            online={message.user?.online}
                        />
                    </View>
                    <View style={styles.contentContainer}>
                        <View style={styles.user}>
                            <Text
                                style={styles.headerText}
                                size={Size.XSmall}
                                fontWeight="600"
                                color={Colors.text.text_gray_black}
                            >
                                {message.user?.name || ''}
                            </Text>
                            <View style={styles.timeIcon}>
                                <>
                                    <Text
                                        style={styles.time}
                                        size={Size.XXXSmall}
                                        color={Colors.text.gray}
                                    >
                                        {Moment(message.created_at).format(
                                            'HH:mm'
                                        ) || ''}
                                    </Text>
                                    <MessageStatus />
                                </>
                            </View>
                        </View>

                        {message.attachments && message.attachments.length > 0 && (
                            <View style={styles.attachments}>
                                {message.attachments.map(
                                    (attachment: Attachment, ind: number) => (
                                        <View
                                            key={`message-${message.id}-attachment-${ind}`}
                                            style={styles.attachmentItem}
                                        >
                                            <MessageContentAttachment
                                                messageId={message.id}
                                                attachment={attachment}
                                            />
                                        </View>
                                    )
                                )}
                            </View>
                        )}

                        <Text
                            style={styles.msgText}
                            size={Size.XXSmall}
                            fontWeight="400"
                            color={Colors.text.black}
                        >
                            {urlifiedMessageText}
                        </Text>
                    </View>
                </TouchableOpacity>
                {!!message.reaction_counts?.like && (
                    <TouchableOpacity
                        style={styles.likeIcon}
                        onPress={() => {
                            bottomSheetRef.current?.open();
                        }}
                    >
                        <ThumbsUpReaction
                            height={15}
                            width={15}
                            pathFill={'blue'}
                        />
                        <Text
                            style={styles.likeCount}
                            size={12}
                            fontWeight="500"
                        >
                            {message.reaction_counts.like}
                        </Text>
                    </TouchableOpacity>
                )}
            </Tooltip>
            <RBSheet
                // @ts-ignore:next-line
                ref={bottomSheetRef}
                closeOnDragDown={true}
                animationType={'fade'}
                closeOnPressMask={true}
                dragFromTopOnly={true}
                customStyles={{
                    wrapper: styles.reactionsListRBSheetWrapper,
                    container: styles.reactionsListRBSheetContainer
                }}
            >
                <ScrollView style={styles.reactionsListView}>
                    {reactionUsers?.map((user, index) => (
                        <View style={styles.reactionsListUserView} key={index}>
                            <ChatAvatar
                                path={user?.image}
                                width={40}
                                height={40}
                                online={message.user?.online}
                            />
                            <Text
                                size={Size.XSmall}
                                fontWeight="600"
                                color={Colors.text.text_gray_black}
                                style={styles.reactionsListUserText}
                            >
                                {user?.name}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.reactionsListViewBottomGap} />
                </ScrollView>
            </RBSheet>
        </>
    );
};

export default MessageContent;

const styles = StyleSheet.create({
    container: {
        width: '83%'
    },
    messageContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.extras.success_lightest,
        borderColor: Colors.extras.black,
        borderStyle: 'solid',
        borderTopEndRadius: 16,
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
        padding: 8,
        marginVertical: 8,
        alignSelf: 'flex-start',
        shadowColor: Colors.extras.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1
    },
    senderMe: {
        borderTopRightRadius: 0,
        backgroundColor: Colors.theme.app_background_lightest
    },
    senderNotMe: {
        borderTopLeftRadius: 0,
        backgroundColor: Colors.extras.success_lightest
    },
    contentContainer: {
        marginLeft: 10,
        width: '80%'
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    time: {
        marginRight: 2
    },
    timeIcon: {
        flexDirection: 'row',
        position: 'relative',
        top: 5
    },
    msgText: {
        textAlign: 'left'
    },
    headerText: {
        width: '80%'
    },
    linkText: {
        textDecorationLine: 'underline',
        textDecorationColor: '#3ED1FF'
    },
    attachments: {
        flexDirection: 'column',
        marginTop: 5,
        justifyContent: 'flex-start'
    },
    attachmentItem: {
        marginVertical: 5
    },
    likeIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ececec',
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 7,
        zIndex: 1,
        position: 'absolute',
        bottom: 0,
        right: -10
    },
    likeCount: {
        marginLeft: 1,
        marginTop: 2
    },
    reactionsSelector: {
        backgroundColor: '#ececec',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderRadius: 10
    },
    reactionsListRBSheetWrapper: {},
    reactionsListRBSheetContainer: {
        width: '94%',
        alignSelf: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    reactionsListView: {
        paddingTop: 30,
        paddingHorizontal: 30
    },
    reactionsListViewBottomGap: {
        height: 50
    },
    reactionsListUserView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.modals.divider
    },
    reactionsListUserText: { marginLeft: 10 },
    tooltipArrowSize: {
        width: 0,
        height: 0
    },
    avatarView: {
        width: '15%'
    },
    tooltipContent: { borderRadius: 15 }
});
