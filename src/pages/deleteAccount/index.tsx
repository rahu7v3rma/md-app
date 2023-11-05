import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { BackIcon, EyeIcon, EyeOpenIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { deleteAccount } from '@/reducers/user';
import { Button, CustomStatusBar, Header, Input, Text } from '@/shared';
import { Colors } from '@/theme/colors';
import { logoutAction } from '@/utils/auth';

type PageState = 'confirm' | 'password';
const pageStateTypes: Record<PageState, PageState> = {
    confirm: 'confirm',
    password: 'password'
};
const pageInitialState = pageStateTypes.confirm;

type Props = Record<string, never>;

const DeleteAccount: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();

    const [pageState, setPageState] = useState<PageState>(pageInitialState);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPaswordError] = useState<string>('');

    const onProceed = () => {
        if (pageState === pageStateTypes.confirm) {
            setPageState(pageStateTypes.password);
        }
        if (pageState === pageStateTypes.password) {
            if (password.length > 0) {
                dispatch(deleteAccount({ password }))
                    .unwrap()
                    .then(() => {
                        logoutAction(true);

                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: 'SignIn' },
                                    { name: 'DeleteAccountSuccess' }
                                ]
                            })
                        );
                    })
                    .catch((error) => {
                        if (error?.data?.code === 'bad_credentials') {
                            Toast.show({
                                type: 'errorResponse',
                                text1: 'Provided password is incorrect',
                                position: 'bottom'
                            });
                        } else {
                            Toast.show({
                                type: 'errorResponse',
                                text1: 'Something went wrong! Please try again',
                                position: 'bottom'
                            });
                        }
                    });
            } else {
                setPaswordError('This field is required');
            }
        }
    };
    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                styles={styles.header}
                leftIcon={BackIcon}
                leftBtnStyles={styles.headerLeftButton}
                onLeftBtnPress={navigation.goBack}
                seperator={false}
            />
            <View style={styles.confirmAndPasswordView}>
                <View>
                    <Text
                        size={24}
                        fontWeight="700"
                        color={Colors.text.black_gray}
                        style={styles.confirmAndPasswordTitle}
                        testID="pageTitle"
                    >
                        {pageState === pageStateTypes.confirm &&
                            'Delete Account'}
                        {pageState === pageStateTypes.password &&
                            'Confirm Account Deletion'}
                    </Text>
                    <Text
                        size={16}
                        color={Colors.text.black_gray}
                        style={styles.confirmAndPasswordSubtitle}
                        testID="pageSubtitle"
                    >
                        {pageState === pageStateTypes.confirm &&
                            'Deleting your account is an irreversible action that will permanently remove all your data from our system.'}
                        {pageState === pageStateTypes.password &&
                            'Please enter your account password to proceed with the account deletion process'}
                    </Text>
                    {pageState === pageStateTypes.confirm && (
                        <Text
                            size={16}
                            color={Colors.text.black_gray}
                            fontWeight="800"
                            style={styles.confirmSubtitle}
                        >
                            Are you sure you want to proceed with deleting your
                            account?
                        </Text>
                    )}
                    {pageState === pageStateTypes.password && (
                        <Input
                            placeholder="Password*"
                            Icon={!isPasswordVisible ? EyeIcon : EyeOpenIcon}
                            secureTextEntry={!isPasswordVisible}
                            iconPress={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                            }
                            style={styles.passwordInput}
                            onChangeText={(val) => {
                                setPassword(val);
                            }}
                            textInputStyle={styles.passwordInputText}
                            showError={
                                password.length === 0 &&
                                passwordError.length > 0
                            }
                            errorMessage={passwordError}
                        />
                    )}
                </View>
                <View style={styles.cancelProceedView}>
                    <Button
                        primary
                        bordered={false}
                        style={styles.cancelButton}
                        onPress={navigation.goBack}
                        testID="cancelButton"
                    >
                        <Text
                            color={Colors.text.white}
                            fontWeight="600"
                            size={14}
                        >
                            Cancel
                        </Text>
                    </Button>
                    <Button
                        primary
                        bordered={false}
                        style={[styles.cancelButton, styles.proceedButton]}
                        onPress={onProceed}
                        testID="proceedButton"
                    >
                        <Text
                            color={Colors.text.white}
                            fontWeight="600"
                            size={14}
                        >
                            Proceed
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default DeleteAccount;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.theme.app_background_lightest
    },
    header: {
        backgroundColor: 'transparent',
        height: 80
    },
    headerLeftButton: {
        backgroundColor: 'white',
        elevation: 5,
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    confirmAndPasswordView: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingBottom: 15
    },
    confirmAndPasswordTitle: {
        marginTop: 20
    },
    confirmAndPasswordSubtitle: {
        marginTop: 30,
        marginRight: 20
    },
    confirmSubtitle: {
        marginTop: 40
    },
    cancelProceedView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 10
    },
    cancelButton: {
        width: '47.5%',
        backgroundColor: Colors.theme.primary,
        height: 56,
        paddingVertical: 0,
        borderRadius: 16
    },
    proceedButton: {
        backgroundColor: Colors.button.app_button_dark_red_background
    },
    passwordInput: {
        marginTop: 22,
        elevation: 5,
        shadowColor: 'lightgray',
        height: 60,
        shadowRadius: 3
    },
    passwordInputText: {
        fontSize: 16,
        fontFamily: 'Poppins',
        fontWeight: '500',
        lineHeight: 22,
        color: Colors.text.mainDarker
    }
});
