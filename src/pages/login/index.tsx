import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
    Dimensions,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { EyeIcon, EyeOpenIcon, LoginLogoIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { userLogin } from '@/reducers/user';
import { requestNotificationPermissions } from '@/services/notification';
import { Button, CustomStatusBar, Input, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

type Props = Record<string, never>;

const { height: windowHeight } = Dimensions.get('window');

const Login: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const [isPassVisible, setIsPassVisible] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');

    const loginPressed = useCallback(() => {
        dispatch(userLogin({ email: userEmail, password: userPassword }))
            .unwrap()
            .then(() => {
                // request notification permissions if needed
                requestNotificationPermissions();
                navigation.navigate('Main');
            })
            .catch((err) => {
                if (err.status === 403) {
                    // being the user's first login and the password must be changed
                    navigation.navigate('ChangePassword', {
                        email: userEmail
                    });
                } else {
                    Toast.show({
                        type: 'errorResponse',
                        text1:
                            err.status === 401
                                ? 'Incorrect username or password'
                                : 'An unknown error has occurred',
                        position: 'bottom'
                    });
                }
            });
    }, [dispatch, navigation, userEmail, userPassword]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={loginStyle.root}>
                <CustomStatusBar />
                <ScrollView
                    contentContainerStyle={{
                        ...loginStyle.scrollViewContentContainerStyle,
                        paddingBottom: insets.bottom
                    }}
                >
                    <View style={loginStyle.inputWrapper}>
                        <LoginLogoIcon />
                        <Text
                            style={loginStyle.headerText}
                            size={Size.XLarge}
                            fontWeight="700"
                            color={Colors.text.mainDarker}
                        >
                            {'Welcome to\nMastering Programs'}
                        </Text>
                        <Input
                            textInputTestID="emailInput"
                            placeholder="Email*"
                            keyboardType="email-address"
                            onChangeText={(val) => {
                                setUserEmail(val);
                            }}
                            textInputStyle={loginStyle.textInputStyle}
                            autoCorrect={false}
                        />
                        <Input
                            textInputTestID="passwordInput"
                            iconPressTestID="passwordInputIcon"
                            placeholder="Password*"
                            Icon={!isPassVisible ? EyeIcon : EyeOpenIcon}
                            secureTextEntry={!isPassVisible}
                            iconPress={() => setIsPassVisible(!isPassVisible)}
                            style={loginStyle.passwordInput}
                            onChangeText={(val) => {
                                setUserPassword(val);
                            }}
                            textInputStyle={loginStyle.textInputStyle}
                        />
                        <TouchableOpacity
                            // navigation to reset password screen from here
                            onPress={() => {
                                navigation.navigate('ResetPassword');
                            }}
                            activeOpacity={0.5}
                            style={loginStyle.forgotPasswordButton}
                        >
                            <Text
                                style={loginStyle.forgetTxt}
                                size={Size.XXSmall}
                                color={Colors.theme.primary}
                                fontWeight="600"
                            >
                                Forgot password ?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={loginStyle.footerContainer}>
                        <Button
                            bordered={false}
                            primary
                            onPress={loginPressed}
                            disabled={userEmail === '' || userPassword === ''}
                            style={loginStyle.signInButton}
                            testID="signInButton"
                        >
                            <Text
                                style={loginStyle.createBtnText}
                                color={Colors.text.white}
                                fontWeight="600"
                            >
                                Sign In
                            </Text>
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Login;
export const loginStyle = StyleSheet.create({
    loginLogo: {
        width: 96,
        height: 96
    },
    root: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    scrollViewContentContainerStyle: {
        height: windowHeight
    },
    headerText: {
        marginVertical: 32,
        textAlign: 'center',
        color: Colors.text.mainDarker
    },
    inputWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 30
    },
    passwordInput: {
        marginTop: 12
    },
    footerContainer: {
        flex: 0.5,
        justifyContent: 'flex-end',
        marginHorizontal: 20,
        marginBottom: 20
    },
    createBtnText: {
        flexGrow: 1,
        textAlign: 'center'
    },
    footerEndContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        alignSelf: 'center',
        marginBottom: COMMON.isIos ? 20 : 50
    },
    footerEndTxt: {
        marginRight: 8,
        textDecorationColor: Colors.text.gray_Base
    },
    textInputStyle: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '500',
        lineHeight: 22,
        color: Colors.text.mainDarker
    },
    forgetTxt: {
        textDecorationColor: Colors.theme.primary,
        textDecorationLine: 'underline'
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: 10
    },
    signInButton: {
        backgroundColor: Colors.theme.primary
    }
});
