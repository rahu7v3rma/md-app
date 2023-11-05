import { StyleSheet } from 'react-native';

import { Colors } from '@/theme/colors';

export const webViewStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        flex: 1,
        position: 'relative'
    },
    webViewStyle: {
        flex: 1
    },
    loader: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: Colors.extras.white,
        zIndex: 10,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        backgroundColor: Colors.extras.white
    },
    innerContainer: {
        flex: 1
    }
});
