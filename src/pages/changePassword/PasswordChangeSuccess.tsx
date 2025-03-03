import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/assets/svgs';
import { Button, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

type Props = {
    onButtonPress: () => void;
};

const PasswordChangeSuccess: FunctionComponent<Props> = ({
    onButtonPress
}: Props) => {
    return (
        <View style={style.wrapper}>
            <View style={style.container}>
                <View style={style.checkIconWrapper}>
                    <CheckIcon />
                </View>

                <Text
                    style={style.text}
                    size={Size.XLarge}
                    fontWeight="800"
                    color={Colors.text.black_gray}
                    testID="changePasswordSuccessText"
                >
                    You successfully changed your password!
                </Text>
            </View>

            <Button
                bordered
                primary
                block
                style={style.btn}
                onPress={onButtonPress}
                testID="moveToHomeButton"
            >
                <Text
                    size={Size.XXSmall}
                    color={Colors.text.white}
                    fontWeight="600"
                >
                    Move to Home
                </Text>
            </Button>
        </View>
    );
};

export default PasswordChangeSuccess;

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkIconWrapper: {
        width: COMMON.responsiveSize(96),
        height: COMMON.responsiveSize(96),
        backgroundColor: Colors.extras.success_lightest,
        borderColor: Colors.extras.success_lighter,
        borderWidth: 1,
        borderBottomWidth: 4,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        width: COMMON.responsiveSize(335),
        marginTop: 40
    },
    btn: {
        alignSelf: 'flex-end'
    }
});
