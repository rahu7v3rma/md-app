/*
<NoDataAvailable
    message='You don’t have any data yet.'
    actionMessage='Press “+” to add data'
/>
*/

import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { NoData } from '@/assets/svgs';
import Text from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    message: string;
    actionMessage?: string;
    style?: StyleProp<ViewStyle>;
};
const NoDataAvailable: FunctionComponent<Props> = ({
    style,
    message,
    actionMessage
}: Props) => {
    return (
        <View style={[styles.root, style]}>
            <NoData width={141} height={201} />
            <Text
                style={styles.message}
                fontWeight="400"
                size={14}
                color={Colors.text.gray_Base}
                testID="messageText"
            >
                {message}
            </Text>
            {actionMessage && (
                <Text
                    style={styles.actionText}
                    fontWeight="700"
                    size={16}
                    color={Colors.text.green}
                    testID="actionMessageText"
                >
                    {actionMessage}
                </Text>
            )}
        </View>
    );
};

export default NoDataAvailable;

const styles = StyleSheet.create({
    root: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    message: {
        marginTop: 20,
        minHeight: 20
    },
    actionText: {
        marginTop: 8,
        minHeight: 22
    }
});
