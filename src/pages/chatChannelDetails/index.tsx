import { RouteProp, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chat, OverlayProvider } from 'stream-chat-react-native';

import { useAppChat } from '@/contexts/appChat';
import { RootStackParamList } from '@/navigation';
import { CustomStatusBar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import { ChannelMemberItem, Header, Title } from './components';

type ContentRouteProp = RouteProp<RootStackParamList, 'ChatChannelDetails'>;

type Props = Record<string, never>;

const ChannelDetails: FunctionComponent<Props> = ({}: Props) => {
    const route = useRoute<ContentRouteProp>();

    const {
        params: { channelId }
    } = route;

    const { chatClient } = useAppChat();

    if (chatClient === null) {
        return null;
    }

    const channel = chatClient.activeChannels[channelId];

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <OverlayProvider>
                <Chat client={chatClient}>
                    <Header channel={channel} />

                    <ScrollView style={styles.scrollView}>
                        <Title channel={channel} />

                        <Text
                            size={Size.XSmall}
                            color={Colors.text.charcoal}
                            fontWeight={'600'}
                            style={styles.membersListTitle}
                        >
                            Chat members
                        </Text>
                        <View style={styles.membersList}>
                            {channel?.state?.members &&
                                Object.keys(channel.state.members).map(
                                    (memberId: string) => {
                                        const user =
                                            channel?.state?.members[memberId]
                                                .user;

                                        return (
                                            <ChannelMemberItem
                                                key={`channel-member-${memberId}`}
                                                avatar={user?.image as string}
                                                name={user?.name || ''}
                                                isOnline={user?.online}
                                                lastSeen={moment(
                                                    user?.last_active
                                                ).fromNow(false)}
                                                memberType={
                                                    user?.role === 'coach'
                                                        ? 'Coach'
                                                        : ''
                                                }
                                            />
                                        );
                                    }
                                )}
                        </View>
                    </ScrollView>
                </Chat>
            </OverlayProvider>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.extras.white
    },
    scrollView: {
        flex: 1,
        paddingTop: 24
    },
    membersListTitle: {
        marginTop: 25,
        marginHorizontal: 20
    },
    membersList: {
        flexDirection: 'column',
        marginVertical: 20,
        marginHorizontal: 20
    }
});

export default ChannelDetails;
