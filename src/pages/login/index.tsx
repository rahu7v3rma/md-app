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
            <SafeAreaView style={styles.root}>
                <CustomStatusBar />
                <ScrollView
                    contentContainerStyle={
                        styles.scrollViewContentContainerStyle
                    }
                >
                    <View style={styles.inputWrapper}>
                        <LoginLogoIcon />
                        <Text
                            style={styles.headerText}
                            size={Size.XLarge}
                            fontWeight="700"
                            numberOfLines={2}
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
                            textInputStyle={styles.textInputStyle}
                            autoCorrect={false}
                        />
                        <Input
                            textInputTestID="passwordInput"
                            iconPressTestID="passwordInputIcon"
                            placeholder="Password*"
                            Icon={!isPassVisible ? EyeIcon : EyeOpenIcon}
                            secureTextEntry={!isPassVisible}
                            iconPress={() => setIsPassVisible(!isPassVisible)}
                            style={styles.passwordInput}
                            onChangeText={(val) => {
                                setUserPassword(val);
                            }}
                            textInputStyle={styles.textInputStyle}
                        />
                        <TouchableOpacity
                            // navigation to reset password screen from here
                            onPress={() => {
                                navigation.navigate('ResetPassword');
                            }}
                            activeOpacity={0.5}
                            style={styles.forgotPasswordButton}
                        >
                            <Text
                                style={styles.forgetTxt}
                                size={Size.XXSmall}
                                numberOfLines={1}
                                color={Colors.theme.primary}
                                fontWeight="600"
                            >
                                Forgot password ?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerContainer}>
                        <Button
                            bordered={false}
                            primary
                            onPress={loginPressed}
                            disabled={userEmail === '' || userPassword === ''}
                            style={styles.signInButton}
                            testID="signInButton"
                        >
                            <Text
                                style={styles.createBtnText}
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
export const styles = StyleSheet.create({
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
        width: 'auto',
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
        justifyContent: 'flex-end',
        marginHorizontal: 20,
        marginBottom: COMMON.isIos ? 100 : 50
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
