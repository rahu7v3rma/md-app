import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckIcon, CrossIcon } from '@/assets/svgs';
import { RootNavigationProp } from '@/navigation';
import { CustomStatusBar, Header, Text } from '@/shared';
import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

const DeleteAccountSuccess: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                styles={styles.header}
                leftIcon={CrossIcon}
                leftBtnStyles={styles.headerLeftButton}
                onLeftBtnPress={navigation.goBack}
                seperator={false}
            />
            <View style={styles.successView}>
                <CheckIcon />
                <Text
                    size={28}
                    fontWeight="700"
                    color={Colors.text.black_gray}
                    style={styles.successTitle}
                >
                    Account Deleted Successfully
                </Text>
                <Text
                    size={16}
                    color={Colors.text.black_gray}
                    style={styles.successSubtitle}
                >
                    Your account has been successfully deleted. All associated
                    data and information have been permanently removed from our
                    system. We appreciate your past engagement and support.
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default DeleteAccountSuccess;

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
    successView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80
    },
    successTitle: {
        marginTop: 40,
        textAlign: 'center'
    },
    successSubtitle: {
        marginTop: 15,
        paddingHorizontal: 35,
        textAlign: 'center'
    }
});
