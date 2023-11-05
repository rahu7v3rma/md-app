import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';

import { BackIcon } from '@/assets/svgs';
import { RootNavigationProp } from '@/navigation';
import { Button, CustomStatusBar, Header, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { logoutAction } from '@/utils/auth';

import SettingOption from './components/SettingOption';

const AppSettings: FunctionComponent = () => {
    const navigation = useNavigation<RootNavigationProp>();
    const isFocused = useIsFocused();

    const [generalNotifications, setGeneralNotifications] = useState(false);
    const [marketingNotifications, setMarketingNotifications] = useState(false);
    const [lightTheme, setLightTheme] = useState(false);

    return (
        <View style={styles.root}>
            {isFocused ? <CustomStatusBar /> : null}
            {Platform.OS === 'ios' && <View style={styles.iosStatusBar} />}
            <View>
                <Header
                    styles={styles.header}
                    leftIcon={BackIcon}
                    onLeftBtnPress={() => navigation.pop()}
                    title="App Settings"
                />
            </View>
            <SafeAreaView style={styles.wrapper}>
                <View style={styles.content}>
                    <Text
                        style={styles.sectionTitle}
                        size={Size.Medium}
                        fontWeight="600"
                        color={Colors.text.darker}
                    >
                        Notifications
                    </Text>
                    <SettingOption
                        text="General notifications"
                        toggled={generalNotifications}
                        onPressToggle={() =>
                            setGeneralNotifications(!generalNotifications)
                        }
                    />
                    <SettingOption
                        text="Marketing notifications"
                        toggled={marketingNotifications}
                        onPressToggle={() =>
                            setMarketingNotifications(!marketingNotifications)
                        }
                    />

                    <Text
                        style={styles.sectionTitle}
                        size={Size.Medium}
                        fontWeight="600"
                        color={Colors.text.darker}
                    >
                        Other
                    </Text>
                    <SettingOption
                        text="Light theme"
                        toggled={lightTheme}
                        onPressToggle={() => setLightTheme(!lightTheme)}
                    />
                </View>

                <View style={styles.buttons}>
                    <Button
                        block
                        style={styles.changePasswordButton}
                        onPress={() =>
                            navigation.navigate('ChangePassword', {})
                        }
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
                        onPress={logoutAction}
                    >
                        <Text
                            size={Size.XXSmall}
                            fontWeight="600"
                            color={Colors.text.green}
                        >
                            Logout
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.theme.app_background_lightest
    },
    iosStatusBar: {
        height: 47,
        backgroundColor: 'white'
    },
    wrapper: {
        flex: 1
    },
    header: {
        paddingHorizontal: 20,
        backgroundColor: Colors.extras.white
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 45
    },
    sectionTitle: {
        marginBottom: 16
    },
    buttons: {
        paddingHorizontal: 20,
        paddingBottom: 45
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
        borderBottomWidth: 0
    }
});

export default AppSettings;
