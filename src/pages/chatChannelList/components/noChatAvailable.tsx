import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import cat from '@/assets/svg/cat.svg';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

const NoChatAvailable: FunctionComponent<Props> = ({}: Props) => {
    return (
        <View style={styles.container}>
            <SvgXml xml={cat} />
            <Text
                fontWeight="400"
                size={Size.XXSmall}
                color={Colors.text.gray_Base}
                style={styles.text}
            >
                You don’t have any chats yet.
            </Text>
        </View>
    );
};

export default NoChatAvailable;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        paddingTop: 20
    }
});
