import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import useAccessibility from '@/hooks/useAccessibility';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import { changePassword, firstChangePassword } from '@/reducers/user';
import { Button, CustomStatusBar, Header, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import Form from './components/Form';
import PasswordChangeSuccess from './PasswordChangeSuccess';
import { changePasswordStyles } from './style';

interface IPasswordState {
    oldPass: string;
    newPass: string;
    confirmPass: string;
}

type ContentRouteProp = RouteProp<RootStackParamList, 'ChangePassword'>;

const ChangePassword: FunctionComponent = () => {
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<ContentRouteProp>();
    const { fontScale, windowHeight } = useAccessibility();

    const dispatch = useAppDispatch();

    const [passwordState, setPasswordState] = useState<IPasswordState>({
        oldPass: '',
        newPass: '',
        confirmPass: ''
    });

    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [isButtonEnable, setIsButtonEnable] = useState(false);
    const accessibleLayout =
        fontScale != null && fontScale > 1.2 && windowHeight < 700;

    const onUpdatePasswordState = useCallback(
        (passwordStateData: IPasswordState) => {
            setPasswordState(passwordStateData);
            if (
                passwordStateData.oldPass &&
                passwordStateData.newPass &&
                passwordStateData.newPass === passwordStateData.confirmPass
            ) {
                setIsButtonEnable(true);
            } else {
                setIsButtonEnable(false);
            }
        },
        [setPasswordState, setIsButtonEnable]
    );

    const onChangePass = useCallback(() => {
        const email = route?.params?.email ?? '';
        dispatch(
            email
                ? firstChangePassword({
                      email,
                      new_password: passwordState.newPass,
                      old_password: passwordState.oldPass
                  })
                : changePassword({
                      new_password: passwordState.newPass,
                      old_password: passwordState.oldPass
                  })
        )
            .unwrap()
            .then(() => {
                setPasswordSuccess(true);
            })
            .catch((err) => {
                let errorText = '';
                if (
                    err.status === 400 &&
                    err.data.code === 'password_unchanged'
                ) {
                    errorText =
                        'New password cannot be the same as old password';
                } else if (
                    err.status === 400 &&
                    err.data.code === 'password_does_not_conform'
                ) {
                    errorText =
                        'Password must be at least 8 characters long, contain letters, not be a common password and not be similar to your email';
                } else if (
                    err.status === 401 &&
                    err.data.code === 'bad_credentials'
                ) {
                    errorText = 'Incorrect old password';
                } else if (
                    err.status === 400 &&
                    err.data.code === 'bad_credentials'
                ) {
                    errorText = 'Incorrect old password';
                } else {
                    errorText = 'An unknown error has occurred';
                }

                Toast.show({
                    type: 'errorResponse',
                    text1: errorText,
                    position: 'bottom'
                });
            });
    }, [
        dispatch,
        passwordState.newPass,
        passwordState.oldPass,
        route.params.email
    ]);

    const onBackPress = () => {
        navigation.pop();
    };

    return (
        <SafeAreaView style={changePasswordStyles.wrapper}>
            <CustomStatusBar />
            <ScrollView contentContainerStyle={changePasswordStyles.container}>
                {!passwordSuccess ? (
                    <>
                        <Header
                            leftIcon={BackIcon}
                            onLeftBtnPress={onBackPress}
                            styles={changePasswordStyles.header}
                            leftIconBgColor={Colors.extras.white}
                            isLeftIconShadow={true}
                        />
                        <View style={changePasswordStyles.innerContainer}>
                            <Text
                                style={[
                                    changePasswordStyles.titleText,
                                    accessibleLayout &&
                                        changePasswordStyles.titleTextAccessible
                                ]}
                                size={Size.Large}
                                color={Colors.text.black_gray}
                                fontWeight="700"
                            >
                                Please change your password
                            </Text>
                            <Form
                                onUpdatePasswordState={onUpdatePasswordState}
                            />

                            <Button
                                primary
                                block
                                bordered={false}
                                style={changePasswordStyles.submitBtn}
                                disabled={!isButtonEnable}
                                onPress={() => onChangePass()}
                                testID="changePasswordButton"
                            >
                                <Text
                                    size={Size.XXSmall}
                                    fontWeight="600"
                                    color={Colors.text.white}
                                >
                                    Change Password
                                </Text>
                            </Button>
                        </View>
                    </>
                ) : (
                    <PasswordChangeSuccess
                        onButtonPress={() => {
                            if (route?.params?.email) {
                                navigation.navigate('Onboarding');
                            } else {
                                navigation.navigate('Main');
                            }
                            setTimeout(() => {
                                setPasswordSuccess(false);
                            }, 300);
                        }}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;
