import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Channel } from 'stream-chat';

import { useChannelPreviewInfo } from '@/hooks';
import { ChatAvatar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    channel: Channel;
};

const Title: FunctionComponent<Props> = ({ channel }: Props) => {
    const { displayImage } = useChannelPreviewInfo({ channel });

    return (
        <View style={styles.groupDetail}>
            <ChatAvatar path={displayImage} width={100} height={100} />
            <Text
                size={Size.Medium}
                color={Colors.text.charcoal}
                fontWeight={'600'}
                style={styles.groupTitle}
            >
                Group Chat
            </Text>
            <Text
                size={Size.XXSmall}
                color={Colors.text.charcoal}
                fontWeight={'500'}
                style={styles.memebersCount}
            >
                {channel.data?.member_count + ' Members'}
            </Text>
        </View>
    );
};

export default Title;

const styles = StyleSheet.create({
    groupDetail: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
    },
    groupTitle: {
        marginTop: 12
    },
    memebersCount: {
        marginTop: 5
    }
});
