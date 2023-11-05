import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { Image as PickedImage } from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

import { BackIcon, EditProfile } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { updateProfile, UserSelectors } from '@/reducers/user';
import { uploadImage } from '@/services/image';
import { Button, CustomStatusBar, Header, ProfileImage, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { logoutAction } from '@/utils/auth';

import ImageChooser from './components/ImageChooser';

type Props = Record<string, never>;

const Profile: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const imageChooser = useRef<RBSheet>(null);

    const { userInfo } = UserSelectors();

    const onImageSelected = useCallback(
        (image: PickedImage) => {
            uploadImage(image.data!, image.mime, userInfo!.username, true)
                .then((uploadedImageName) => {
                    dispatch(updateProfile({ image: uploadedImageName }));

                    Toast.show({
                        type: 'successResponse',
                        text1: 'Profile picture updated',
                        position: 'bottom'
                    });
                })
                .catch(() => {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'Upload failed, please try again',
                        position: 'bottom'
                    });
                });
        },
        [userInfo, dispatch]
    );

    const handleChangePasswordPress = useCallback(() => {
        navigation.navigate('ChangePassword', {});
    }, [navigation]);

    const handleLogoutPress = useCallback(() => {
        logoutAction();
    }, []);

    const handleDeleteAccountPress = useCallback(() => {
        navigation.navigate('DeleteAccount');
    }, [navigation]);

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                leftIcon={BackIcon}
                onLeftBtnPress={() => navigation.pop()}
                title="Settings"
            />
            <View style={styles.contentWrapper}>
                <View style={styles.profileImageView}>
                    <ProfileImage
                        style={styles.profileImage}
                        width={100}
                        height={100}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            imageChooser.current?.open();
                        }}
                        testID="editProfilePic"
                        style={styles.imageButton}
                    >
                        <EditProfile />
                    </TouchableOpacity>
                </View>
                <Text
                    style={styles.headerText}
                    size={Size.XLarge}
                    fontWeight="700"
                    color={Colors.text.text_gray_black}
                >
                    {userInfo?.first_name + ' ' + userInfo?.last_name}
                </Text>
                <Text
                    style={styles.emailText}
                    size={Size.XSmall}
                    color={Colors.theme.primary}
                    fontWeight="400"
                >
                    {userInfo?.email}
                </Text>
                <View style={styles.list}>
                    <Button
                        testID="changepassword"
                        block
                        style={styles.changePasswordButton}
                        onPress={handleChangePasswordPress}
                    >
                        <Text
                            size={Size.XXSmall}
                            fontWeight="600"
                            color={Colors.text.white}
                        >
                            Change password
                        </Text>
                    </Button>
                    <Button
                        testID="logout"
                        style={styles.logoutButton}
                        block
                        onPress={handleLogoutPress}
                    >
                        <Text
                            size={Size.XXSmall}
                            fontWeight="600"
                            color={Colors.text.green}
                        >
                            Logout
                        </Text>
                    </Button>
                    <Button
                        testID="deleteAccount"
                        style={styles.deleteAccountButton}
                        block
                        onPress={handleDeleteAccountPress}
                    >
                        <Text
                            size={Size.XXSmall}
                            fontWeight="600"
                            color={Colors.text.white}
                        >
                            Delete account
                        </Text>
                    </Button>
                </View>
                <Text
                    style={styles.versionText}
                    size={Size.XXXSmall}
                    color={Colors.text.gray}
                    fontWeight="500"
                >
                    Version app {getVersion()}
                </Text>
            </View>
            <ImageChooser
                closeChooser={() => imageChooser.current?.close()}
                onImageSelected={onImageSelected}
                bottomSheetRef={imageChooser}
                cropping={true}
            />
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.theme.app_background_lightest
    },
    content: {
        flex: 1,
        backgroundColor: Colors.extras.page_bg
    },
    imageButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.button.app_button_background,
        position: 'absolute',
        bottom: -2,
        right: -2,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImageView: {
        marginTop: 45
    },
    profileImage: {
        height: 110,
        width: 110,
        borderRadius: 50
    },
    emailText: {
        textAlign: 'center'
    },
    headerText: {
        marginTop: 32,
        textAlign: 'center'
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    list: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 70
    },
    versionText: {
        position: 'absolute',
        bottom: 20
    },
    changePasswordButton: {
        backgroundColor: Colors.button.app_button_green_background,
        borderWidth: 0,
        borderBottomWidth: 0
    },
    logoutButton: {
        marginTop: 16,
        backgroundColor: Colors.button.app_button_white_background,
        borderWidth: 0,
        borderBottomWidth: 0,
        shadowColor: Colors.extras.black,
        shadowRadius: 17,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        elevation: 0.1
    },
    deleteAccountButton: {
        marginTop: 16,
        backgroundColor: Colors.button.app_button_red_background,
        borderWidth: 0,
        borderBottomWidth: 0
    }
});
