import Moment from 'moment';
import React, {
    FunctionComponent,
    RefObject,
    useCallback,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    IconProps,
    useChatContext,
    useMessageContext,
    ReactionList,
    OverlayProvider,
    MessageOverlayProvider
} from 'stream-chat-react-native';

import { ChatAvatar, Text } from '@/shared';
import { PdfViewerHandle } from '@/shared/pdfViewer';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { customReactionData } from '@/utils/constants';

import MessageContentAttachmentGroup from './messageContentAttachment';
import MessageQuoted from './messageQuoted';
import MessageStatus from './messageStatus';

type Props = {
    pdfViewerRef: RefObject<PdfViewerHandle>;
};

const MessageContent: FunctionComponent<Props> = ({ pdfViewerRef }: Props) => {
    const { client } = useChatContext();

    const { message, goToMessage, showMessageOverlay } = useMessageContext();
    const [messageContentWidth, setmessageContentWidth] = useState<number>(100);

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
                            testID="message-link"
                        >
                            {part}
                        </Text>
                    );
                }
                return part;
            });
    }, [message]);

    const customReactionDataMapping = useMemo(
        () =>
            customReactionData.reduce((a: any, b) => {
                a[b.type] = b.Icon;
                return a;
            }, {}),
        []
    );

    const bottomSheetRef = useRef<RBSheet>();

    const reactionUsers = useMemo(() => {
        // Check if 'latest_reactions' is available and is an array
        if (!Array.isArray(message.latest_reactions)) {
            return {};
        }

        // Reduce function to accumulate reactions
        return message.latest_reactions.reduce((acc: any, reaction) => {
            // Ensure reaction has 'user_id' and 'type', and 'customReactionDataMapping' has the 'type'
            if (
                !reaction?.user_id ||
                !reaction?.type ||
                !customReactionDataMapping[reaction.type]
            ) {
                return acc;
            }

            // Use a temporary variable for better readability
            let userData = acc[reaction.user_id];

            // Initialize the user in the accumulator if not already present
            if (!userData) {
                userData = acc[reaction.user_id] = {
                    user: reaction.user,
                    type: []
                };
            }

            // Add the reaction type to the user's data
            userData.type.push(customReactionDataMapping[reaction.type]);

            return acc;
        }, {});
    }, [customReactionDataMapping, message]);

    const QuotedMessage = useCallback(() => {
        if (message.quoted_message) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        message.quoted_message?.id &&
                            goToMessage &&
                            goToMessage(message.quoted_message.id);
                    }}
                >
                    <MessageQuoted
                        userImage={message.quoted_message.user?.image}
                        attachments={message.quoted_message.attachments}
                        text={message.quoted_message.text}
                        attachmentIconSize={20}
                        textLength={40}
                    />
                </TouchableOpacity>
            );
        }
        return <></>;
    }, [message, goToMessage]);
    return (
        <OverlayProvider >
            <TouchableOpacity
                key={message.id}
                style={[
                    styles.messageContainer,
                    isSenderMe ? styles.senderMe : styles.senderNotMe
                ]}
                onLongPress={() => {
                    showMessageOverlay(true);
                }}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setmessageContentWidth(width);
                }}
            >
                <View style={styles.avatarView}>
                    <ChatAvatar
                        path={message.user?.image}
                        width={40}
                        height={40}
                        online={message.user?.online}
                    />
                    <View style={styles.userView}>
                        <View style={styles.user}>
                            <Text
                                style={styles.headerText}
                                size={Size.XSmall}
                                fontWeight="600"
                                color={Colors.text.text_gray_black}
                                testID="user-name"
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
                    </View>
                </View>
                <QuotedMessage />
                <View style={styles.contentContainer}>
                    {message.attachments && message.attachments.length > 0 && (
                        <MessageContentAttachmentGroup
                            messageId={message.id}
                            attachments={message.attachments}
                            pdfViewerRef={pdfViewerRef}
                        />
                    )}

                    <Text
                        style={styles.msgText}
                        size={Size.XXSmall}
                        fontWeight="400"
                        color={Colors.text.black}
                        testID="message-text"
                    >
                        {urlifiedMessageText}
                    </Text>
                </View>
                <View
                    style={[
                        styles.reactionsContainer,
                        {
                            width: messageContentWidth,
                            transform: [{ translateX: messageContentWidth / 2 }]
                        }
                    ]}
                >
                    <ReactionList
                        alignment="right"
                        messageContentWidth={messageContentWidth}
                        onPress={() => {
                            bottomSheetRef.current?.open();
                        }}
                        onLongPress={() => {
                            bottomSheetRef.current?.open();
                        }}
                        supportedReactions={customReactionData}
                    />
                </View>
            </TouchableOpacity>
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
                <ScrollView
                    style={styles.reactionsListView}
                    testID="reactionsList"
                >
                    {reactionUsers ? (
                        Object.keys(reactionUsers).map((user_id, index) => (
                            <View
                                key={`user-reaction-${index}`}
                                style={styles.RBsheetReactionContainer}
                            >
                                <View style={styles.reactionsListUserView}>
                                    <ChatAvatar
                                        path={reactionUsers[user_id].user.image}
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
                                        {reactionUsers[user_id].user.name}
                                    </Text>
                                </View>
                                <View style={styles.RBSheetReactions}>
                                    {reactionUsers[user_id].type.map(
                                        (
                                            Icon: React.FC<IconProps>,
                                            iconIndex: number
                                        ) => (
                                            <Icon
                                                key={`user-reaction-${index}-${iconIndex}`}
                                                height={15}
                                                width={15}
                                                pathFill={'blue'}
                                            />
                                        )
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        <></>
                    )}
                    <View style={styles.reactionsListViewBottomGap} />
                </ScrollView>
            </RBSheet>
        </OverlayProvider>
    );
};

export default MessageContent;

const styles = StyleSheet.create({
    container: {
        maxWidth: '83%'
    },
    messageContainer: {
        flexDirection: 'column',
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
        marginLeft: 10
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        paddingLeft: 10
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
    headerText: {},
    linkText: {
        textDecorationLine: 'underline',
        textDecorationColor: '#3ED1FF'
    },
    reactionIcon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
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
        marginBottom: 10
    },
    reactionsListUserText: { marginLeft: 10 },
    tooltipArrowSize: {
        width: 0,
        height: 0
    },
    avatarView: {
        flexDirection: 'row'
    },
    tooltipContent: { borderRadius: 15 },
    tooltipContentView: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    chatAvatar: { alignSelf: 'flex-end' },
    userView: {
        width: '80%',
        justifyContent: 'center'
    },
    bottomReactionsContainer: {
        backgroundColor: '#ececec',
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 7,
        zIndex: 1,
        position: 'absolute',
        bottom: 0,
        right: -10,
        flex: 1,
        flexDirection: 'row',
        gap: 7
    },
    reactionsContainer: {
        position: 'absolute',
        top: -10,
        right: 0
    },
    RBsheetReactionContainer: {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.modals.divider
    },
    RBSheetReactions: {
        flex: 1,
        flexDirection: 'row',
        gap: 7
    }
});
