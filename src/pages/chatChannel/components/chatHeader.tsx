import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { Channel } from 'stream-chat';

import { ArrowNext, BackIcon } from '@/assets/svgs';
import { useChannelPreviewInfo } from '@/hooks';
import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    channel: Channel;
    onTitlePress?: () => void;
    onBack?: () => void;
};

const ChatHeader: FunctionComponent<Props> = ({
    channel,
    onTitlePress,
    onBack
}: Props) => {
    const { displayImage, displayTitle, isOnline, totalMembers } =
        useChannelPreviewInfo({
            channel
        });

    return (
        <View style={styles.header}>
            <TouchableOpacity
                testID="backButton"
                onPress={onBack}
                style={styles.roundedIconBtn}
            >
                <BackIcon />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.chatUserName}
                testID="titlePress"
                onPress={() => {
                    if (totalMembers > 2 && onTitlePress) {
                        onTitlePress();
                    }
                }}
            >
                {totalMembers === 2 && (
                    <View style={styles.profile}>
                        <ChatAvatar
                            path={displayImage}
                            width={24}
                            height={24}
                            online={isOnline}
                        />
                    </View>
                )}
                <View style={totalMembers > 2 && styles.groupChatHeader}>
                    <Text
                        testID="displayTitle"
                        style={styles.headerText}
                        size={Size.XSmall}
                        fontWeight="600"
                        color={Colors.theme.primary}
                        numberOfLines={1}
                        lineBreakMode="tail"
                    >
                        {displayTitle}
                    </Text>
                    {totalMembers > 2 && (
                        <ArrowNext
                            width={18}
                            height={18}
                            color={Colors.theme.primary}
                        />
                    )}
                </View>
                {totalMembers > 2 && (
                    <Text
                        testID="totalMembers"
                        size={Size.XXXSmall}
                        fontWeight="400"
                        color={Colors.text.text_gray_black}
                        numberOfLines={1}
                    >
                        {totalMembers + ' ' + 'members'}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ChatHeader;

const styles = StyleSheet.create({
    roundedIconBtn: {
        backgroundColor: Colors.button.app_icon_button_background,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginLeft: 20
    },
    profile: {
        position: 'relative',
        marginLeft: 10
    },
    headerText: {
        marginLeft: 6,
        lineHeight: 22
    },
    chatUserName: {
        justifyContent: 'center',
        flex: 1,
        marginRight: 65,
        alignItems: 'center'
    },
    groupChatHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
