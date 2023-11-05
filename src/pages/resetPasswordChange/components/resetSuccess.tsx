import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/assets/svgs';
import { RootNavigationProp } from '@/navigation';
import { Button, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

type Props = Record<string, never>;

const ResetSuccess: FC<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();

    return (
        <View style={resetSuccessStyles.wrapper}>
            <SafeAreaView style={resetSuccessStyles.container}>
                <View style={resetSuccessStyles.messageView}>
                    <View style={resetSuccessStyles.checkBox}>
                        <CheckIcon />
                    </View>
                    <Text
                        style={resetSuccessStyles.titleText}
                        size={Size.XLarge}
                        fontWeight="700"
                    >
                        {'You successfully\nchanged your\npassword!'}
                    </Text>
                </View>
                <Button
                    primary
                    style={resetSuccessStyles.moveToHomeBtn}
                    onPress={() => navigation.navigate('SignIn')}
                >
                    <Text
                        color={Colors.text.white}
                        fontWeight="600"
                        style={resetSuccessStyles.moveToHomeTxt}
                    >
                        Move to SignIn
                    </Text>
                </Button>
            </SafeAreaView>
        </View>
    );
};
export default ResetSuccess;

const resetSuccessStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    messageView: {
        height: '89%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        textAlign: 'center'
    },
    checkBox: {
        height: 96,
        width: 96,
        borderRadius: 35,
        borderWidth: 3,
        borderBottomWidth: 10,
        borderColor: Colors.extras.success_lighter,
        backgroundColor: Colors.extras.success_lightest,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    moveToHomeBtn: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    moveToHomeTxt: {
        position: 'relative',
        top: COMMON.isIos ? 0 : 2.2
    }
});
