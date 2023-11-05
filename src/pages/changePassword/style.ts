import { Dimensions, StyleSheet } from 'react-native';

import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

const { height: windowHeight } = Dimensions.get('window');

export const changePasswordStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        height: windowHeight
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 20
    },
    header: {
        backgroundColor: Colors.extras.transparent
    },
    headerBtn: {
        width: COMMON.responsiveSize(52),
        height: COMMON.responsiveSize(52),
        backgroundColor: Colors.input.app_input_bg
    },
    titleText: {
        marginTop: 40,
        width: COMMON.responsiveSize(COMMON.isIos ? 225 : 245)
    },
    inputContainer: {
        marginTop: 22
    },
    input: {
        marginVertical: 5
    },
    submitBtn: {
        bottom: 0,
        position: 'absolute',
        backgroundColor: Colors.theme.primary,
        marginBottom: COMMON.isIos ? 100 : 25
    },
    textInput: {
        fontFamily: 'Poppins',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '500'
    }
});
