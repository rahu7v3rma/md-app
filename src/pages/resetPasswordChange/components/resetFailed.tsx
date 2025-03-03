import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { CrossIcon } from '@/assets/svgs';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

const ResetFailed: FC<Props> = ({}: Props) => {
    return (
        <View style={resetFailureStyles.wrapper}>
            <SafeAreaView style={resetFailureStyles.container}>
                <View style={resetFailureStyles.checkBox}>
                    <CrossIcon />
                </View>
                <Text
                    style={resetFailureStyles.titleTextError}
                    size={Size.Large}
                    fontWeight="700"
                >
                    The reset link is no longer valid
                </Text>
                <Text
                    style={resetFailureStyles.descText}
                    size={Size.XSmall}
                    color={Colors.text.gray_Base}
                >
                    Please try to reset you password again to receive a new
                    link.
                </Text>
            </SafeAreaView>
        </View>
    );
};
export default ResetFailed;

const resetFailureStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        flex: 1,
        marginBottom: 25,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkBox: {
        height: 96,
        width: 96,
        borderRadius: 35,
        borderWidth: 3,
        borderBottomWidth: 10,
        borderColor: Colors.extras.error_lighter,
        backgroundColor: Colors.extras.error_lightest,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    titleTextError: {
        marginTop: 40,
        textAlign: 'center',
        width: '70%'
    },
    descText: {
        marginTop: 12,
        textAlign: 'center'
    }
});
