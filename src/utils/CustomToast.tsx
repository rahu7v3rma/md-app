import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast, { ToastConfigParams } from 'react-native-toast-message';

import { CheckIcon, CrossIcon } from '@/assets/svgs';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

const toastConfig = {
    successResponse: ({ text1 }: ToastConfigParams<any>) => (
        <View style={[styles.container, styles.successContainer]}>
            <View style={styles.errorIconStyle}>
                <CheckIcon width={14} height={14} color={Colors.text.black} />
            </View>
            <Text
                style={styles.titleStyle}
                size={Size.XXSmall}
                color={Colors.text.white}
                fontWeight="600"
            >
                {text1}
            </Text>
        </View>
    ),
    errorResponse: ({ text1 }: ToastConfigParams<any>) => (
        <View style={[styles.container, styles.errorContainer]}>
            <TouchableOpacity
                style={styles.errorIconStyle}
                onPress={() => Toast.hide()}
            >
                <CrossIcon width={12} height={12} color={Colors.text.error} />
            </TouchableOpacity>
            <Text
                style={styles.titleStyle}
                size={Size.XXSmall}
                color={Colors.text.white}
            >
                {text1}
            </Text>
        </View>
    ),
    info: ({ text1 }: ToastConfigParams<any>) => (
        <View style={[styles.container, styles.infoContainer]}>
            <Text
                style={styles.titleStyle}
                size={Size.XXSmall}
                color={Colors.text.white}
            >
                {text1}
            </Text>
        </View>
    )
};

export default toastConfig;

const styles = StyleSheet.create({
    titleStyle: {
        marginLeft: 15
    },
    successIconStyle: {
        width: 25,
        height: 25,
        borderRadius: 25,
        backgroundColor: Colors.extras.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorIconStyle: {
        width: 17,
        height: 17,
        borderRadius: 17,
        backgroundColor: Colors.extras.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: 55,
        width: '90%',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 65
    },
    successContainer: {
        backgroundColor: Colors.toast.successBackground
    },
    errorContainer: {
        backgroundColor: Colors.toast.errorBackground
    },
    infoContainer: {
        backgroundColor: Colors.toast.infoBackground
    }
});
