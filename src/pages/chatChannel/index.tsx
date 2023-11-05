import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import { Dimensions, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel as ChannelType } from 'stream-chat';
import {
    Channel,
    Chat,
    DateHeaderProps,
    InlineDateSeparatorProps,
    MessageList,
    OverlayProvider
} from 'stream-chat-react-native';

import { useAppChat } from '@/contexts/appChat';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import { CustomStatusBar } from '@/shared';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

import {
    ChatHeader,
    DateHeader,
    MessageContent,
    MessageInput as CustomMessageInput
} from './components';

type ContentRouteProp = RouteProp<RootStackParamList, 'ChatChannel'>;

type Props = Record<string, never>;

const ChannelScreen: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<ContentRouteProp>();

    const {
        params: { channelId, messageId }
    } = route;

    const { chatClient, setActiveChatChannel } = useAppChat();

    const [channel, setChannel] = useState<ChannelType | null>(null);

    useEffect(() => {
        if (chatClient && channelId) {
            if (chatClient.activeChannels[channelId]) {
                setChannel(chatClient.activeChannels[channelId]);
            } else {
                chatClient
                    .queryChannels({ cid: { $eq: channelId } })
                    .then((channels) => {
                        if (channels.length > 0) {
                            setChannel(channels[0]);
                        }
                    });
            }
        }
    }, [chatClient, channelId]);

    useEffect(() => {
        setActiveChatChannel?.(channel?.cid || null);

        return () => {
            setActiveChatChannel?.(null);
        };
    }, [setActiveChatChannel, channel?.cid]);

    const inputRender = useCallback(() => <CustomMessageInput />, []);

    const renderDateHeader = useCallback(
        ({ dateString }: DateHeaderProps) => (
            <DateHeader dateString={dateString} />
        ),
        []
    );

    const renderInlineDateSeparator = useCallback(
        ({ date }: InlineDateSeparatorProps) => (
            <DateHeader dateString={Moment(date).format('MMM D')} />
        ),
        []
    );

    const renderMessageAvatar = useCallback(() => <View />, []);

    const renderMessageContent = useCallback(() => {
        return <MessageContent />;
    }, []);

    const handleChatHeaderTitlePress = useCallback(() => {
        navigation.navigate('ChatChannelDetails', { channelId });
    }, [navigation, channelId]);

    return (
        <GestureHandlerRootView style={styles.root}>
            <CustomStatusBar />
            <SafeAreaView>
                <OverlayProvider
                    value={{
                        style: {
                            messageInput: {
                                inputBoxContainer: {
                                    marginLeft: 0,
                                    borderWidth: 0,
                                    paddingVertical:
                                        Platform.OS === 'android' ? 8 : 5
                                },
                                sendButtonContainer: {
                                    display: 'none'
                                },
                                inputBox: {
                                    paddingVertical: 0,
                                    paddingTop: 0,
                                    paddingBottom: 0
                                },
                                autoCompleteInputContainer: {
                                    paddingLeft: 0,
                                    paddingRight: 0
                                },
                                optionsContainer: {
                                    paddingRight: 0
                                },
                                container: {
                                    width: Dimensions.get('window').width - 122,
                                    padding: 0
                                },
                                attachmentSelectionBar: {
                                    height: 0
                                }
                            },
                            messageSimple: {
                                giphy: {
                                    container: {
                                        width:
                                            Dimensions.get('window').width *
                                            0.53
                                    },
                                    selectionContainer: {
                                        width:
                                            Dimensions.get('window').width *
                                            0.53
                                    },
                                    giphy: {
                                        width:
                                            Dimensions.get('window').width *
                                            0.53
                                    }
                                },
                                gallery: {
                                    galleryContainer: {
                                        width:
                                            Dimensions.get('window').width *
                                            0.53
                                    }
                                }
                            },
                            attachmentSelectionBar: {
                                container: {
                                    backgroundColor: Colors.extras.page_bg,
                                    backfaceVisibility: 'hidden',
                                    paddingHorizontal: 0
                                },
                                icon: {
                                    display: 'none'
                                }
                            },
                            attachmentPicker: {
                                bottomSheetContentContainer: {
                                    backgroundColor: Colors.extras.white
                                }
                            }
                        }
                    }}
                >
                    {chatClient && (
                        <Chat client={chatClient}>
                            {channel && (
                                <Channel
                                    key={`channel-${channel.cid}`}
                                    channel={channel}
                                    MessageContent={renderMessageContent}
                                    MessageAvatar={renderMessageAvatar}
                                    DateHeader={renderDateHeader}
                                    InlineDateSeparator={
                                        renderInlineDateSeparator
                                    }
                                    messageId={messageId}
                                    keyboardVerticalOffset={
                                        COMMON.isIos ? 0 : undefined
                                    }
                                >
                                    <View style={styles.container}>
                                        <ChatHeader
                                            channel={channel}
                                            onTitlePress={
                                                handleChatHeaderTitlePress
                                            }
                                            onBack={() =>
                                                navigation.canGoBack() &&
                                                navigation.goBack()
                                            }
                                        />
                                        <MessageList
                                            onListScroll={Keyboard.dismiss}
                                            additionalFlatListProps={{
                                                contentContainerStyle:
                                                    styles.messageListContainer
                                            }}
                                        />
                                        {inputRender()}
                                    </View>
                                </Channel>
                            )}
                        </Chat>
                    )}
                </OverlayProvider>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.extras.white
    },
    container: {
        flex: 1
    },

    messageListContainer: {
        backgroundColor: Colors.extras.page_bg,
        paddingHorizontal: 20
    }
});
export default ChannelScreen;
