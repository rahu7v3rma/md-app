import { Platform, StyleSheet } from 'react-native';

import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

export const contentStyle = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    wrapper: {
        flex: 1
    },
    header: {
        backgroundColor: 'transparent'
    },
    title: {
        lineHeight: 32,
        paddingHorizontal: 20,
        marginVertical: 20,
        color: Colors.text.dark_black,
        fontFamily: 'Poppins',
        fontSize: 24,
        fontWeight: '700',
        opacity: 1
    },
    progress: {
        marginTop: 20
    },
    videoPlayer: {
        marginTop: 31,
        width: 334,
        alignSelf: 'center'
    },
    imageView: {
        marginTop: 31,
        height: 223,
        width: 334,
        alignSelf: 'center'
    },
    loader: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLeftBtn: {
        backgroundColor: 'white',
        elevation: 5,
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12,
        paddingVertical: 5,
        marginBottom: Platform.OS === 'ios' ? 0 : 10
    },
    btn: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 20,
        height: COMMON.responsiveSize(56),
        paddingVertical: 0
    }
});
