import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { getVersion } from 'react-native-device-info';
import Toast from 'react-native-toast-message';

import { BackIcon, CrossIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import useAccessibility from '@/hooks/useAccessibility';
import { RootNavigationProp } from '@/navigation';
import { resetPassword } from '@/reducers/user';
import { Button, CustomStatusBar, Header, Input, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

import SentInstructions from './components/sentInstruction';

type Props = Record<string, never>;

const { height: windowHeight } = Dimensions.get('window');

const ResetPassword: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const { fontScale } = useAccessibility();

    const [email, setEmail] = useState<string>('');
    const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const dispatch = useAppDispatch();

    const accessibleLayout =
        fontScale != null && fontScale > 1.2 && windowHeight < 700;

    const onBackPress = useCallback(() => {
        if (emailSentSuccess) {
            setEmailSentSuccess(false);
            navigation.navigate('SignIn');
        } else {
            navigation.pop();
        }
    }, [emailSentSuccess, navigation]);

    const handleResetPassword = useCallback(() => {
        setEmailError(email ? '' : 'Field is required');
        if (email) {
            const client = `app-${
                COMMON.isIos ? 'ios' : 'android'
            }@${getVersion()}`;
            dispatch(resetPassword({ email, client }))
                .unwrap()
                .then(() => {
                    setEmailSentSuccess(true);
                })
                .catch(() => {
                    let errorText = 'An unknown error has occurred';
                    Toast.show({
                        type: 'errorResponse',
                        text1: errorText,
                        position: 'bottom'
                    });
                });
        }
    }, [dispatch, email]);

    const onChangeEmail = useCallback((value: string) => {
        setEmail(value);
        setEmailError(value ? '' : 'Field is required');
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={resetPasswordStyles.wrapper}>
                <SafeAreaView style={resetPasswordStyles.container}>
                    <CustomStatusBar />
                    <ScrollView
                        contentContainerStyle={
                            resetPasswordStyles.scrollViewContentContainerStyle
                        }
                    >
                        <Header
                            isLeftIconShadow
                            leftIconBgColor={Colors.extras.white}
                            styles={resetPasswordStyles.header}
                            onLeftBtnPress={onBackPress}
                            leftIcon={!emailSentSuccess ? BackIcon : CrossIcon}
                        />
                        {!emailSentSuccess ? (
                            <View style={resetPasswordStyles.innerContainer}>
                                <Text
                                    style={[
                                        resetPasswordStyles.titleText,
                                        accessibleLayout &&
                                            resetPasswordStyles.titleTextAccessible
                                    ]}
                                    size={Size.Large}
                                    fontWeight="700"
                                    color={Colors.text.text_gray_black}
                                >
                                    Reset Password
                                </Text>
                                <Text
                                    style={resetPasswordStyles.subTitleText}
                                    size={Size.XSmall}
                                    fontWeight="400"
                                    color={Colors.text.text_gray_black}
                                >
                                    {
                                        "Please enter the email address you used when creating your account and we'll send you an email with instructions on how to reset your password."
                                    }
                                </Text>
                                <Input
                                    placeholder="Email*"
                                    keyboardType="email-address"
                                    onChangeText={onChangeEmail}
                                    textInputStyle={
                                        resetPasswordStyles.textInputStyle
                                    }
                                    autoCorrect={false}
                                    showError={!!emailError}
                                    errorMessage={emailError}
                                />
                                <Button
                                    primary
                                    block
                                    bordered={false}
                                    style={resetPasswordStyles.submitBtn}
                                    onPress={() => {
                                        handleResetPassword();
                                    }}
                                >
                                    <Text
                                        fontWeight="600"
                                        color={Colors.text.white}
                                    >
                                        Reset Password
                                    </Text>
                                </Button>
                            </View>
                        ) : (
                            <SentInstructions enteredEmail={email} />
                        )}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ResetPassword;
const resetPasswordStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        flex: 1,
        position: 'relative'
    },
    scrollViewContentContainerStyle: {
        height: windowHeight
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 20
    },
    titleText: {
        marginTop: 40,
        width: COMMON.responsiveSize(COMMON.isIos ? 225 : 245)
    },
    titleTextAccessible: {
        width: '100%'
    },
    submitBtn: {
        bottom: 10,
        position: 'absolute',
        backgroundColor: Colors.theme.primary,
        marginBottom: COMMON.isIos ? 100 : 25
    },
    subTitleText: {
        marginTop: 10,
        marginBottom: 30
    },
    textInputStyle: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: '#271A51'
    },
    header: {
        backgroundColor: Colors.extras.transparent
    }
});
