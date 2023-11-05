import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    Dimensions,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

import { BackIcon, EyeIcon, EyeOpenIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import { resetPasswordConfirm, resetPasswordVerify } from '@/reducers/user';
import { Button, CustomStatusBar, Header, Input, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

import { ResetFailed, ResetSuccess } from './components';

type Props = Record<string, never>;
type ContentRouteProp = RouteProp<RootStackParamList, 'ResetPasswordChange'>;

const { height: windowHeight } = Dimensions.get('window');

const ResetPasswordChange: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<ContentRouteProp>();
    const dispatch = useAppDispatch();

    const [newPassword, setNewPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [newPassVisible, setNewPassVisible] = useState<boolean>(false);
    const [repeatPassVisible, setRepeatPassVisible] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        dispatch(resetPasswordVerify({ code: route.params.code }))
            .unwrap()
            .catch((err: any) => {
                if (err.data.code === 'bad_token') {
                    setShowError(true);
                } else {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'An unknown error has occurred',
                        position: 'bottom'
                    });
                    navigation.pop();
                }
            });
    }, [dispatch, navigation, route.params.code]);

    const onBackPress = () => {
        navigation.pop();
    };

    const handleChangePassword = useCallback(async () => {
        dispatch(
            resetPasswordConfirm({
                code: route.params.code,
                password: newPassword
            })
        )
            .unwrap()
            .then(() => {
                setShowSuccess(true);
            })
            .catch((err: any) => {
                if (err.status === 400 && err.data.code === 'bad_token') {
                    setShowError(true);
                } else if (
                    err.status === 400 &&
                    err.data.code === 'password_does_not_conform'
                ) {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'Password must be at least 8 characters long or more complex',
                        position: 'bottom'
                    });
                } else {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'An unknown error has occurred',
                        position: 'bottom'
                    });
                }
            });
    }, [dispatch, route.params.code, newPassword]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={createPasswordStyles.wrapper}>
                <SafeAreaView style={createPasswordStyles.container}>
                    <CustomStatusBar />
                    <ScrollView
                        contentContainerStyle={
                            createPasswordStyles.scrollViewContentContainerStyle
                        }
                    >
                        <Header
                            isLeftIconShadow
                            leftIconBgColor={Colors.extras.white}
                            styles={createPasswordStyles.header}
                            onLeftBtnPress={onBackPress}
                            leftIcon={BackIcon}
                        />
                        {!showSuccess && !showError && (
                            <View style={createPasswordStyles.innerContainer}>
                                <Text
                                    style={createPasswordStyles.titleText}
                                    size={Size.Large}
                                    fontWeight="700"
                                    color={Colors.text.black_gray}
                                >
                                    Reset Password
                                </Text>
                                <View
                                    style={createPasswordStyles.inputContainer}
                                >
                                    <Input
                                        placeholder="Create a New Password*"
                                        Icon={
                                            !newPassVisible
                                                ? EyeIcon
                                                : EyeOpenIcon
                                        }
                                        iconPress={() =>
                                            setNewPassVisible(!newPassVisible)
                                        }
                                        secureTextEntry={!newPassVisible}
                                        keyboardType="default"
                                        onChangeText={(val) => {
                                            setNewPassword(val);
                                        }}
                                    />
                                    <Input
                                        style={
                                            createPasswordStyles.passwordInput
                                        }
                                        placeholder="Repeat Password*"
                                        Icon={
                                            !repeatPassVisible
                                                ? EyeIcon
                                                : EyeOpenIcon
                                        }
                                        secureTextEntry={!repeatPassVisible}
                                        iconPress={() =>
                                            setRepeatPassVisible(
                                                !repeatPassVisible
                                            )
                                        }
                                        keyboardType="default"
                                        onChangeText={(val) => {
                                            setRepeatPassword(val);
                                        }}
                                    />
                                </View>

                                <Button
                                    primary
                                    block
                                    bordered={false}
                                    style={createPasswordStyles.submitBtn}
                                    disabled={
                                        (newPassword === '' &&
                                            repeatPassword === '') ||
                                        newPassword !== repeatPassword
                                    }
                                    onPress={handleChangePassword}
                                >
                                    <Text
                                        fontWeight="600"
                                        color={Colors.text.white}
                                    >
                                        Change Password
                                    </Text>
                                </Button>
                            </View>
                        )}
                        {showSuccess && <ResetSuccess />}
                        {showError && (
                            <ResetFailed>
                                The reset token is invalid. Please request a new
                                one
                            </ResetFailed>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ResetPasswordChange;
const createPasswordStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        flex: 1,
        marginHorizontal: 20,
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
    submitBtn: {
        bottom: 10,
        position: 'absolute',
        marginBottom: COMMON.isIos ? 100 : 25
    },
    inputContainer: {
        marginTop: 30
    },
    passwordInput: {
        marginTop: 20
    },
    header: {
        backgroundColor: Colors.extras.transparent
    }
});
