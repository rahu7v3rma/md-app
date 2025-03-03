import { StyleSheet } from 'react-native';

import { Colors } from '@/theme/colors';

export const unitSettingStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    continer: {
        flex: 1,
        marginHorizontal: 20,
        position: 'relative',
        marginBottom: 25
    },
    titleText: {
        marginBottom: 15,
        marginTop: 30
    },
    submitBtn: {
        bottom: 0,
        position: 'absolute'
    },
    optionView: {
        borderWidth: 1,
        borderColor: Colors.input.app_input,
        backgroundColor: Colors.input.app_input_bg,
        borderRadius: 20,
        borderBottomWidth: 5,
        flexDirection: 'row',
        marginTop: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    optionText: {
        margin: 20
    },
    selectedOption: {
        backgroundColor: Colors.text.white,
        borderColor: Colors.theme.primary
    }
});
