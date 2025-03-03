import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ChannelList, Chat, OverlayProvider } from 'stream-chat-react-native';

import { SearchIcon } from '@/assets/svgs';
import { useAppChat } from '@/contexts/appChat';
import { RootNavigationProp } from '@/navigation';
import { UserSelectors } from '@/reducers/user';
import { CustomStatusBar, Header } from '@/shared';
import { Colors } from '@/theme/colors';

import { ChannelList as CustomChannelList } from './components';

type Props = Record<string, never>;

const ChatChannelList: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();

    const { chatClient } = useAppChat();
    const { coach, hasCoachChat } = UserSelectors();

    const goToChatSearch = () => {
        navigation.navigate('ChatSearch');
    };

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                title="Chats"
                rightIcon={SearchIcon}
                onRightBtnPress={goToChatSearch}
                styles={styles.header}
            />
            <GestureHandlerRootView style={styles.container}>
                {chatClient === null ? (
                    <View style={styles.loader}>
                        <ActivityIndicator
                            size={'large'}
                            color={Colors.progress.activity_indicator}
                        />
                    </View>
                ) : (
                    <OverlayProvider>
                        <Chat client={chatClient}>
                            <ChannelList
                                Preview={CustomChannelList}
                                filters={
                                    coach && !hasCoachChat
                                        ? {
                                              $and: [
                                                  {
                                                      members: {
                                                          $in: [
                                                              chatClient.userID
                                                          ]
                                                      }
                                                  },
                                                  {
                                                      $or: [
                                                          {
                                                              $and: [
                                                                  {
                                                                      member_count:
                                                                          {
                                                                              $eq: 2
                                                                          }
                                                                  },
                                                                  {
                                                                      members: {
                                                                          $nin: [
                                                                              coach.chat_id
                                                                          ]
                                                                      }
                                                                  }
                                                              ]
                                                          },
                                                          {
                                                              member_count: {
                                                                  $gt: 2
                                                              }
                                                          }
                                                      ]
                                                  }
                                              ]
                                          }
                                        : {
                                              members: {
                                                  $in: [chatClient.userID]
                                              }
                                          }
                                }
                                additionalFlatListProps={{
                                    contentContainerStyle: {
                                        backgroundColor: Colors.extras.page_bg,
                                        flex: 1,
                                        paddingTop: 12
                                    }
                                }}
                            />
                        </Chat>
                    </OverlayProvider>
                )}
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.extras.white
    },
    container: {
        flex: 1,
        backgroundColor: Colors.extras.page_bg
    },
    notificationContainer: {
        position: 'relative'
    },
    notificationPoint: {
        position: 'absolute',
        right: 2
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    loader: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: 0,
        left: 0,
        justifyContent: 'center'
    },
    header: {
        elevation: 5,
        shadowOffset: { width: 0, height: 2 }
    }
});

export default ChatChannelList;
