import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ArrowNext } from '@/assets/svgs';
import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { LayoutContants } from '@/theme/layoutContants';

type Props = {
    avatar?: any;
    label: string;
    lastMessage?: string;
    time?: string;
    newMessagesCount?: number;
    isOnline?: boolean;
    onPress?: () => void;
    style?: any;
    mainTouchID?: string;
    msgCountID?: string;
};

const ChatListItem: FunctionComponent<Props> = ({
    avatar,
    isOnline = false,
    label,
    lastMessage = '',
    time = '',
    newMessagesCount = 0,
    onPress,
    style,
    mainTouchID,
    msgCountID
}: Props) => {
    return (
        <TouchableOpacity
            testID={mainTouchID}
            onPress={onPress}
            style={[styles.wrapper, style]}
        >
            <View style={styles.firstCol}>
                <View style={styles.avatarView}>
                    <ChatAvatar
                        path={avatar}
                        width={24}
                        height={24}
                        online={isOnline}
                        style={styles.avatar}
                    />
                </View>
            </View>
            <View style={styles.secondCol}>
                <Text
                    size={Size.XSmall}
                    fontWeight="700"
                    color={Colors.text.black}
                >
                    {label}
                </Text>
                {lastMessage !== '' && (
                    <Text size={Size.XXXSmall} color={Colors.text.gray}>
                        {lastMessage.substring(0, 29).concat('...')}
                    </Text>
                )}
            </View>
            <View style={styles.thirdCol}>
                {!time ? (
                    <ArrowNext
                        width={32}
                        height={32}
                        color={Colors.text.purple}
                    />
                ) : (
                    <>
                        <Text size={Size.XXXSmall} color={Colors.text.gray}>
                            {time}
                        </Text>
                        {newMessagesCount > 0 && (
                            <View
                                testID={msgCountID}
                                style={styles.messagesCountView}
                            >
                                <Text color={Colors.text.white}>3</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ChatListItem;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        borderColor: Colors.button.app_button_disabled_bg,
        height: LayoutContants.cardHeight,
        elevation: 1,
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: Colors.theme.app_sheet_background_color
    },
    firstCol: {
        width: '20%',
        alignItems: 'center'
    },
    avatarView: {
        position: 'relative',
        width: 32,
        height: 32,
        borderRadius: 32 / 2
    },
    avatar: {
        width: 32,
        height: 32
    },
    online: {
        position: 'absolute'
    },
    secondCol: {
        width: '60%'
    },
    label: {
        color: Colors.text.black
    },
    thirdCol: {
        width: '20%',
        alignItems: 'center'
    },
    messagesCountView: {
        width: 16,
        height: 16,
        borderRadius: 16 / 2,
        backgroundColor: Colors.theme.primary,
        alignItems: 'center',
        marginTop: 3
    }
});
