import { StyleSheet } from 'react-native';

import { Colors } from '@/theme/colors';

export const signupStyle = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    wrapper: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    headerText: {
        marginVertical: 32
    },
    inputWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    passwordInput: {
        marginTop: 12,
        backgroundColor: Colors.extras.white
    },
    footerContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginHorizontal: 20
    },
    termsAndConditionsContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        alignItems: 'center'
    },
    termsAndConditions: {
        flexGrow: 0.9,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        textAlign: 'center',
        marginLeft: 10
    },
    termsAndConditionBtnTxt: {
        borderBottomWidth: 4,
        textDecorationColor: Colors.text.green,
        textDecorationLine: 'underline'
    },
    createBtn: {
        marginTop: 24,
        flexDirection: 'row',
        backgroundColor: Colors.button.app_button_green_background
    },
    createBtnText: {
        flexGrow: 1,
        textAlign: 'center'
    },
    footerEndContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        alignSelf: 'center'
    },
    footerEndTxt: {
        marginRight: 8
    }
});
