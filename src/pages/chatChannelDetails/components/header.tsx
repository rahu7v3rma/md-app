import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { Channel } from 'stream-chat';

import { BackIcon } from '@/assets/svgs';
import { useChannelPreviewInfo } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    channel: Channel;
};

const Header: FunctionComponent<Props> = ({ channel }: Props) => {
    const navigation = useNavigation<RootNavigationProp>();

    const { displayTitle } = useChannelPreviewInfo({ channel });

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                onPress={navigation.goBack}
                style={styles.roundedIconBtn}
            >
                <BackIcon />
            </TouchableOpacity>
            <Text
                size={Size.XSmall}
                color={Colors.text.green}
                fontWeight={'600'}
                style={styles.title}
            >
                {displayTitle}
            </Text>
            <View style={styles.box} />
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: Colors.extras.white,
        shadowColor: Colors.extras.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 4
    },
    roundedIconBtn: {
        backgroundColor: Colors.button.app_button_lighter_background,
        borderStyle: 'solid',
        borderRadius: 60,
        borderColor: Colors.button.app_button_lighter_border,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderWidth: 1,
        borderBottomWidth: 2.5
    },
    title: {
        margin: 'auto',
        flex: 1,
        textAlign: 'center'
    },
    box: {
        width: 48
    }
});
