import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChannelPreviewMessengerProps } from 'stream-chat-react-native';

import { useChannelPreviewInfo } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { LayoutContants } from '@/theme/layoutContants';

const ChannelList: FunctionComponent<ChannelPreviewMessengerProps> = ({
    channel,
    latestMessagePreview,
    unread
}: ChannelPreviewMessengerProps) => {
    const navigation = useNavigation<RootNavigationProp>();

    const handleOnPress = () => {
        navigation.navigate('ChatChannel', {
            channelId: channel.cid
        });
    };

    const { messageObject } = latestMessagePreview;
    const createdAt = messageObject?.created_at;
    const latestMessageDate: string = moment(createdAt).format('hh:mm A');
    const { displayImage, displayTitle, isOnline } = useChannelPreviewInfo({
        channel
    });

    return (
        <TouchableOpacity onPress={handleOnPress} activeOpacity={0.7}>
            <View style={ChannelListStyle.container}>
                <ChatAvatar
                    path={displayImage}
                    width={32}
                    height={32}
                    online={isOnline}
                />
                <View style={ChannelListStyle.channelTitleWrapper}>
                    <Text
                        size={Size.XSmall}
                        fontWeight="600"
                        color={Colors.text.black}
                        testID="displayTitle"
                        numberOfLines={1}
                    >
                        {displayTitle}
                    </Text>
                    <View style={ChannelListStyle.subTitle}>
                        <Text numberOfLines={1}>
                            {latestMessagePreview.previews.map(
                                (preview, index) => (
                                    <Text key={index}>{preview.text}</Text>
                                )
                            )}
                        </Text>
                    </View>
                </View>
                <View style={ChannelListStyle.dateAndNotificationWrapper}>
                    <Text
                        size={Size.XXXSmall}
                        fontWeight="400"
                        color={Colors.text.gray}
                        testID="messageDate"
                    >
                        {latestMessageDate}
                    </Text>
                    <View style={ChannelListStyle.notificationContainer}>
                        {(unread as number) > 0 && (
                            <View
                                style={ChannelListStyle.notificationBackground}
                            >
                                <Text
                                    fontWeight="500"
                                    color={Colors.text.white}
                                    testID="unread"
                                >
                                    {unread as number}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChannelList;

const ChannelListStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.extras.white,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 23,
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 12,
        elevation: 1,
        shadowOpacity: 0.06,
        shadowRadius: 3,
        borderColor: Colors.button.app_button_disabled_bg,
        shadowOffset: { width: 0, height: 0 },
        height: LayoutContants.cardHeight,
        shadowColor: Colors.theme.app_sheet_background_color
    },
    channelTitleWrapper: {
        flex: 2.3,
        alignItems: 'flex-start',
        marginLeft: 12
    },
    subTitle: {
        marginTop: LayoutContants.gapSpacing,
        flexDirection: 'row'
    },
    dateAndNotificationWrapper: {
        flex: 0.7,
        alignItems: 'flex-end'
    },
    notificationContainer: {
        height: 16,
        minWidth: 16
    },
    notificationBackground: {
        height: 16,
        minWidth: 16,
        fontSize: 11,
        borderRadius: 16 / 2,
        backgroundColor: Colors.theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
        padding: 3
    }
});
