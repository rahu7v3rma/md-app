import React, { FunctionComponent } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    UIManager,
    View,
    ViewStyle
} from 'react-native';

import { Colors } from '@/theme/colors';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
    toggled: boolean;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    swichTestID?: string;
    switchCircleTestID?: string;
};

const Switch: FunctionComponent<Props> = ({
    toggled,
    style,
    onPress,
    swichTestID,
    switchCircleTestID
}: Props) => {
    const switchButton = React.useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, []);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            testID={swichTestID}
            style={[
                SwitchStyle.wrapper,
                toggled && SwitchStyle.activeSwitchStyle,
                style
            ]}
            onPress={() => {
                switchButton();
                onPress && onPress();
            }}
        >
            <View
                testID={switchCircleTestID}
                style={[
                    SwitchStyle.toggleCircle,
                    toggled && SwitchStyle.activeSwitchCircle
                ]}
            />
        </TouchableOpacity>
    );
};

export default Switch;

const SwitchStyle = StyleSheet.create({
    wrapper: {
        borderRadius: 30,
        width: 37,
        height: 22,
        backgroundColor: Colors.button.app_button_lighter_background,
        borderColor: Colors.button.app_button_border,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    toggleCircle: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        backgroundColor: Colors.switch.button,
        marginLeft: 1
    },
    activeSwitchStyle: {
        backgroundColor: Colors.switch.toggled,
        alignItems: 'flex-end'
    },
    activeSwitchCircle: {
        marginRight: 1
    }
});
