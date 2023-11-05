import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    name: string;
    isOnline?: boolean;
    lastSeen?: string;
    avatar?: string;
    memberType?: string;
};

const ChannelMemberItem: FunctionComponent<Props> = ({
    name,
    avatar,
    isOnline,
    lastSeen,
    memberType
}: Props) => {
    return (
        <View style={styles.memberItem}>
            <ChatAvatar path={avatar} width={40} height={40} />
            <View style={styles.memberNameView}>
                <Text
                    size={Size.XXSmall}
                    color={Colors.text.charcoal}
                    fontWeight={'500'}
                >
                    {name}
                </Text>
                {isOnline ? (
                    <Text
                        fontWeight={'400'}
                        color={Colors.text.charcoal}
                        size={Size.XXXSmall}
                    >
                        Online
                    </Text>
                ) : (
                    <Text
                        fontWeight={'400'}
                        color={Colors.text.gray}
                        size={Size.XXXSmall}
                    >
                        {lastSeen}
                    </Text>
                )}
            </View>

            {memberType && (
                <Text
                    fontWeight={'500'}
                    size={Size.XXXSmall}
                    color={Colors.text.dusky_olive}
                    style={styles.memberType}
                >
                    {memberType}
                </Text>
            )}
        </View>
    );
};

export default ChannelMemberItem;

const styles = StyleSheet.create({
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    memberNameView: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center'
    },
    memberType: {
        backgroundColor: Colors.button.app_button_lighter_background,
        borderRadius: 6,
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        overflow: 'hidden'
    }
});
